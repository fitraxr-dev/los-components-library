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
      prevVisibleRef.current = true;
    } else if (!props.visible && prevVisibleRef.current) {
      masintonReset();
      prevVisibleRef.current = false;
    }
  }, [props.visible, masintonChange, masintonReset]);

  const { mutate: createRisalahRapat, isPending: isSaveLoading } = useMutation({
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
      localStorage.removeItem('statusRR');
      queryClient.invalidateQueries({ queryKey: ['risalah-rapat-renewal']});
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
    // Format: 2025-11-05T00:00:00+07:00
    const formattedDate = dayJsJakartaKeep(toCurrentDate());

    // Get file extension
    const fileExtension = documentValue.extension || documentValue.name?.split('.').pop() || '';

    // Generate fileName with format: RisalahRapat_{documentName}_{documentNumber}_{date}
    const dateForFileName = toDateStringNumber(toCurrentDate()).replace(/\//g, '');
    const generatedFileName = `RisalahRapat_${documentName.value}_${documentNumber.value}_${dateForFileName}`;

    // Prepare payload values for logging
    const payloadValues = {
      bucketProcessId: props.bucketProcessId || processId || '',
      document: documentValue.file,
      documentCategory: 'RISALAH_RAPAT',
      documentDate: formattedDate,
      documentExtension: fileExtension,
      documentGroup: 'RISALAH_RAPAT',
      documentName: documentName.value || '',
      documentNumber: documentNumber.value || '',
      documentParent: 'RISALAH_RAPAT',
      documentType: 'RISALAH_RAPAT',
      fileName: generatedFileName,
      module: props.module || '',
      ownership: 'RISALAH_RAPAT_MERGED',
      process: props.process || '',
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
    formDataPayload.append('documentCategory', payloadValues.documentCategory);
    formDataPayload.append('documentExtension', payloadValues.documentExtension);
    formDataPayload.append('documentGroup', payloadValues.documentGroup);
    formDataPayload.append('documentName', payloadValues.documentName);
    formDataPayload.append('documentNumber', payloadValues.documentNumber);
    formDataPayload.append('documentParent', payloadValues.documentParent);
    formDataPayload.append('documentType', payloadValues.documentType);
    formDataPayload.append('fileName', payloadValues.fileName);
    formDataPayload.append('module', payloadValues.module);
    formDataPayload.append('ownership', payloadValues.ownership);
    formDataPayload.append('process', payloadValues.process);

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

    createRisalahRapat(formDataPayload);
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
