import { useEffect, useState } from 'react';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAddDocument from '@/hooks/services/useAddDocument';
import useGetDocumentById from '@/hooks/services/useGetDocumentById';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { modal } from './ModalUploadDocument.constants';
import { formData, validation } from './ModalUploadDocument.form';

import type { ModalUploadDocumentProps } from './ModalUploadDocument.types';


const useModalUploadDocument = (props: ModalUploadDocumentProps) => {
  const {
    process,
    module,
    documentParent,
    id,
    title,
    ownership,
  } = props;

  const { processId } = useIdentity();
  const [keywordDocumentGroup, setKeyworDocumentGroup] = useState('');
  const [keywordDocumentType, setKeyworDocumentType] = useState('');

  const {
    masintonForm,
    masintonMultiChange,
    masintonChange,
    masintonValidation,
    masintonSubmit,
    masintonMagic,
  } = useMasintonForm(formData, validation);

  const {
    documentGroup: { value: documentGroup },
    documentType: { value: documentType },
    documentCategory: { value: documentCategory },
    document: { value: document },
  } = masintonForm;

  const {
    data: documentDetailData,
    isSuccess: isDocumentDetailSuccess,
  } = useGetDocumentById(
    { id }, { enabled: id !== undefined && id !== null });


  useEffect(() => {
    const {
      documentExtension,
      document, fileName,
      documentGroupLabel,
      documentGroup,
      documentType,
      documentTypeLabel,
    } = documentDetailData || {};

    if (documentDetailData && isDocumentDetailSuccess) {
      const newData = structuredClone(documentDetailData);
      const data = Object.assign(newData, {
        document: document ? {
          extension: `.${documentExtension}`,
          name: fileName.split('.')?.[0],
          url: document,
        } : null,
        documentGroup: {
          id: documentGroup,
          label: documentGroupLabel,
        },
        documentType: {
          id: documentType,
          label: documentTypeLabel,
        },
      });
      masintonMagic(data ?? {});
    }
  }, [documentDetailData, isDocumentDetailSuccess]);

  const { data: documentGroupData, isFetching: isFetchDocumentGroupLoading } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: documentCategory,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentTypeName',
        value: keywordDocumentGroup,
      },
    },
    { enabled: !!documentCategory }
  );

  const { data: documentTypeData, isFetching: isFetchDocumentTypeLoading } = useGetParameterDocumentType(
    {
      filter: {
        documentGroupCode: documentGroup?.id,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentGroupName',
        value: keywordDocumentType,
      },
    },
    { enabled: !!documentGroup?.id }
  );

  const { mutate: saveDocument, isPending: isSaveLoading } = useAddDocument({
    onSuccess: () => {
      closeNiceModal(modal.MODAL_UPLOAD_DOCUMENT);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = () => {
    if (!masintonValidation()) return;

    const payload = Object.assign(masintonSubmit(), {
      bucketProcessId: String(processId),
      document: document.file,
      documentExtension: document.extension.replace('.', ''),
      documentGroup: documentGroup?.id,
      documentParent,
      documentType: documentType?.id,
      fileName: document.name,
      id,
      module,
      ownership,
      process,
    });
    saveDocument(payload);
  };

  const generateTitle = (id: number) => {
    if (id) {
      return title ? `Edit ${title}` : 'Edit Dokumen';
    } else {
      return title ? `Add ${title}` : 'Add Dokumen';
    }
  };

  return {
    documentGroupData,
    documentTypeData,
    generateTitle,
    handleSave,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isSaveLoading,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
  };
};

export default useModalUploadDocument;
