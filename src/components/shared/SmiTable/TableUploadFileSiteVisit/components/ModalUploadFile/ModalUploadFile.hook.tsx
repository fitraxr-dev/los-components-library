import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { dayJsJakartaKeep } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAddDocument from '@/hooks/services/useAddDocument';
import useGetDocumentById from '@/hooks/services/useGetDocumentById';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';


import { modal } from './ModalUploadFile.constants';
import { formData, validation } from './ModalUploadFile.form';

import type { ModalUploadFileProps } from './ModalUploadFile.types';


const useModalUploadFile = (props: ModalUploadFileProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  const {
    process,
    module,
    id,
    title,
    ownerId,
    documentParent,
    ownership,
    documentCategory,
  } = props;

  const { processId } = useIdentity();
  const [keywordFileGroup, setKeyworFileGroup] = useState('');
  const [keywordFileType, setKeyworFileType] = useState('');

  const {
    masintonForm,
    masintonMultiChange,
    masintonChange,
    masintonValidation,
    masintonSubmit,
    masintonMagic,
  } = useMasintonForm(formData, validation);

  const {
    typeFile: { value: typeFile },
    fileName: { value: fileName },
    file: { value: file },
  } = masintonForm;

  const {
    data: documentDetailData,
    isSuccess: isDocumentDetailSuccess,
  } = useGetDocumentById(
    { id }, { enabled: id !== undefined && id !== null });

  useEffect(() => {
    const {
      documentExtension,
      document, documentName,
    } = documentDetailData || {};

    if (documentDetailData && isDocumentDetailSuccess) {
      const newData = structuredClone(documentDetailData);
      const data = Object.assign(newData, {
        file: document ? {
          extension: `.${documentExtension}`,
          name: documentName,
          url: document,
        } : null,
        fileName: documentName,
        typeFile: `.${documentExtension}`,
      });
      masintonMagic(data ?? {});
    }
  }, [documentDetailData, isDocumentDetailSuccess]);

  const { mutate: saveDocument, isPending: isSaveLoading } = useAddDocument({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['site-visit-file']});
      }, 1000);

      showNiceModalV2({
        onClose: () => closeNiceModal(modal.MODAL_UPLOAD_FILE),
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = () => {
    if (!masintonValidation()) return;

    const payload = {
      bucketProcessId: String(processId),
      document: file?.file,
      documentCategory,
      documentDate: dayJsJakartaKeep(new Date()),
      documentExtension: typeFile,
      documentGroup: 'GALLERY_SITE_VISIT',
      documentName: fileName,
      documentNumber: '',
      documentParent,
      documentType: 'GALLERY_SITE_VISIT',
      fileName,
      id,
      module,
      ownerId,
      ownership,
      process,
    };

    setUploadProgress(0);
    saveDocument(payload as any);
  };

  const generateTitle = (id: number) => {
    if (id) {
      return title ? `Edit ${title}` : 'Foto & Video Site Visit';
    } else {
      return title ? `Add ${title}` : 'Foto & Video Site Visit';
    }
  };

  return {
    generateTitle,
    handleSave,
    isSaveLoading,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    setKeyworFileGroup,
    setKeyworFileType,
    uploadProgress,
  };
};

export default useModalUploadFile;
