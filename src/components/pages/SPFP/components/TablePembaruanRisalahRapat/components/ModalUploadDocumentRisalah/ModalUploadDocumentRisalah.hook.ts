import { useEffect, useRef } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import { dayJsJakartaKeep, toCurrentDate, toDateStringNumber } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { formData, modal, validation } from './ModalUploadDocumentRisalah.constants';

import type { ModalUploadDocumentRisalahProps } from './ModalUploadDocumentRisalah.types';


const useModalUploadDocumentRisalah = (props: ModalUploadDocumentRisalahProps & { visible?: boolean }) => {
  const { processId } = useIdentity();
  const queryClient = useQueryClient();
  const prevVisibleRef = useRef(false);

  const {
    masintonForm,
    masintonMultiChange,
    masintonChange,
    masintonValidation,
    masintonReset,
  } = useMasintonForm(formData, validation);

  const {
    uploadDate: { value: uploadDate },
    document,
    documentName,
    documentNumber,
  } = masintonForm;

  const documentValue = document.value;

  const { validateFile, acceptedFormatsText } = useCheckFileDokument();

  // Set upload date when modal opens (only once per modal open) and reset form when modal closes
  useEffect(() => {
    if (props.visible && !prevVisibleRef.current) {
      const currentDateStr = toDateStringNumber(toCurrentDate());
      masintonChange('uploadDate', currentDateStr);

      // If edit mode, populate form with initial data
      if (props.isEdit && props.initialData) {
        if (props.initialData.documentName) {
          masintonChange('documentName', props.initialData.documentName);
        }
        if (props.initialData.documentNumber) {
          masintonChange('documentNumber', props.initialData.documentNumber);
        }
      }

      prevVisibleRef.current = true;
    } else if (!props.visible && prevVisibleRef.current) {
      masintonReset();
      prevVisibleRef.current = false;
    }
  }, [props.visible, props.isEdit, props.initialData, masintonChange, masintonReset]);

  const { mutate: reactivateRisalahRapat, isPending: isSaveLoading } = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await API('bucket.risalahRapat.reactivate', {
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onError: (error: any) => {
      showNiceModalV2({
        title: error?.message || 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      masintonReset();
      closeNiceModal(modal.MODAL_UPLOAD_DOCUMENT_RISALAH);
      queryClient.invalidateQueries({ queryKey: ['risalah-rapat-merged']});
      // Invalidate check expired queries
      queryClient.invalidateQueries({ queryKey: ['risalah-rapat-check-expired']});
      queryClient.invalidateQueries({ queryKey: ['check-risalah-rapat-expired']});
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = () => {
    if (!masintonValidation()) return;

    if (!documentValue || !documentValue.file) {
      showNiceModalV2({
        title: 'Upload Dokumen tidak boleh kosong',
        type: 'error',
      });
      return;
    }

    // Use current date as documentDate in ISO format with Jakarta timezone
    // Format: 2025-11-21T10:57:14+07:00
    const formattedDate = dayJsJakartaKeep(toCurrentDate());

    // Prepare payload values for logging
    const payloadValues = {
      bucketProcessId: props.bucketProcessId || processId || '',
      document: {
        extension: documentValue.extension,
        file: documentValue.file,
        name: documentValue.name,
        size: documentValue.file?.size,
        type: documentValue.file?.type,
      },
      documentDate: formattedDate,
      documentName: documentName.value || '',
      documentNo: documentNumber.value || '',
      module: props.module || '',
      process: props.process || '',
      uploadDate: uploadDate,
    };

    // Verify file exists before creating FormData
    if (!documentValue.file || !(documentValue.file instanceof File || documentValue.file instanceof Blob)) {
      showNiceModalV2({
        title: 'File dokumen tidak valid',
        type: 'error',
      });
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append('bucketProcessId', payloadValues.bucketProcessId);
    formDataPayload.append('module', payloadValues.module);
    formDataPayload.append('process', payloadValues.process);
    formDataPayload.append('documentName', payloadValues.documentName);
    formDataPayload.append('documentNo', payloadValues.documentNo);
    // Ensure documentDate is not empty before appending
    if (formattedDate) {
      formDataPayload.append('documentDate', formattedDate);
      console.log('documentDate appended to FormData:', formattedDate);
    } else {
      console.error('documentDate is empty, cannot append to FormData');
      showNiceModalV2({
        title: 'Tanggal dokumen tidak valid',
        type: 'error',
      });
      return;
    }
    // Append File/Blob object directly
    formDataPayload.append('document', documentValue.file, documentValue.file instanceof File ? documentValue.file.name : 'document');

    // If edit mode, append documentId
    if (props.isEdit && props.documentId) {
      formDataPayload.append('documentId', props.documentId.toString());
    }

    Array.from(formDataPayload.entries()).forEach(([key, value]) => {
      if (value instanceof File) {
        console.log(`${key}:`, {
          lastModified: value.lastModified,
          name: value.name,
          size: value.size,
          type: value.type,
        });
      } else {
        console.log(`${key}:`, value);
      }
    });

    reactivateRisalahRapat(formDataPayload);
  };

  const getFileHelperText = () => {
    if (document.value?.error && document.value?.errorMessage) {
      return document.value.errorMessage;
    }
    if (document.error && document.errorMessage) {
      return document.errorMessage;
    }
    return `Supported formats: ${acceptedFormatsText}`;
  };

  return {
    acceptedFormatsText,
    document,
    documentName,
    documentNumber,
    getFileHelperText,
    handleSave,
    isSaveLoading,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    uploadDate,
    validateFile,
  };
};

export default useModalUploadDocumentRisalah;
