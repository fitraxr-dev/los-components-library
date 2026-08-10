import { useEffect, useState, useRef } from 'react';

import dayjs from 'dayjs';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAddDocument from '@/hooks/services/useAddDocument';
import useGetDocumentById from '@/hooks/services/useGetDocumentById';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import {
  documentCategoryDropdownList,
  modal,
  RATING_UPLOAD_FILE_RATING_HISTORY,
} from './ModalUploadDocument.constants';
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
    type,
    autoSelectGroupId,
  } = props;

  const { processId, debiturName } = useIdentity();
  const [keywordDocumentGroup, setKeyworDocumentGroup] = useState('');
  const [keywordDocumentType, setKeyworDocumentType] = useState('');

  const hasSetInitialData = useRef(false);
  const hasSetCategory = useRef(false);

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
    documentNumber: { value: documentNumber },
    documentDate: { value: documentDate },
  } = masintonForm;

  const { data: documentDetailData, isSuccess: isDocumentDetailSuccess } = useGetDocumentById(
    { id: +id }, { enabled: id !== undefined && id !== null }
  );

  useEffect(() => {
    if (type && !hasSetCategory.current) {
      const foundCategory = documentCategoryDropdownList.find((dt) => dt.id === type);

      if (foundCategory) {
        masintonChange('documentCategory', foundCategory);
        hasSetCategory.current = true;
      }
    }
  }, [type, masintonChange]);

  useEffect(() => {
    if (documentDetailData && isDocumentDetailSuccess && id && !hasSetInitialData.current) {
      const {
        documentExtension,
        document: documentUrl,
        fileName,
        documentGroupLabel,
        documentGroup: docGroup,
        documentType: docType,
        documentTypeLabel,
        documentCategory: docCategory,
        documentCategoryLabel,
        documentNumber: docNumber,
        documentDate: docDate,
      } = documentDetailData;

      const processedData = {
        document: documentUrl ? {
          extension: `.${documentExtension}`,
          name: fileName.split('.')?.[0],
          url: documentUrl,
        } : null,
        documentCategory: {
          id: docCategory,
          label: documentCategoryLabel,
        },
        documentDate: docDate,
        documentGroup: {
          id: docGroup,
          label: documentGroupLabel,
        },
        documentNumber: docNumber,
        documentType: {
          id: docType,
          label: documentTypeLabel,
        },
      };

      masintonMagic(processedData);
      hasSetInitialData.current = true;
      hasSetCategory.current = true;
    }
  }, [documentDetailData, isDocumentDetailSuccess, id, masintonMagic]);

  const { data: documentGroupData, isFetching: isFetchDocumentGroupLoading } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: documentCategory?.id,
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
    { enabled: !!documentCategory?.id }
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

  useEffect(() => {
    if (documentGroupData?.length > 0 && autoSelectGroupId && !id && !documentGroup?.id) {
      const targetGroup = documentGroupData.find(
        (group: any) => group.id === autoSelectGroupId
      );

      if (targetGroup) {
        masintonMultiChange({
          documentGroup: targetGroup,
          documentType: null,
        });
      }
    }
  }, [documentGroupData, autoSelectGroupId, id, documentGroup?.id, masintonMultiChange]);

  useEffect(() => {
    if (documentGroup?.id && !documentType?.id && !id) {
      const targetDocumentType = documentTypeData?.find(
        (type: any) => type.id === RATING_UPLOAD_FILE_RATING_HISTORY
      );

      if (targetDocumentType) {
        masintonChange('documentType', targetDocumentType);
      }
    }
  }, [documentGroup?.id, documentTypeData, documentType?.id, id, masintonChange]);

  const { mutate: saveDocument, isPending: isSaveLoading } = useAddDocument({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(modal.MODAL_UPLOAD_DOCUMENT);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = () => {
    if (!masintonValidation()) {
      return;
    }

    const formData = masintonSubmit();

    const payload = {
      ...formData,
      bucketProcessId: String(processId),
      document: document?.file,
      documentCategory: documentCategory?.id || documentCategory?.value,
      documentExtension: document?.extension?.replace('.', ''),
      documentGroup: documentGroup?.id,
      documentGroupLabel: documentGroup?.label,
      documentParent,
      documentType: documentType?.id,
      documentTypeLabel: documentType?.label,
      fileName: `${documentType?.label}_${debiturName}_${documentNumber}_${dayjs(documentDate).format('DDMMYYYY')}`,
      id: id ? +id : undefined,
      module,
      ownership,
      process,
    };

    saveDocument(payload);
  };

  const generateTitle = (documentId?: number) => {
    if (documentId) {
      return title ? `Edit ${title}` : 'Edit Dokumen';
    } else {
      return title ? `Add ${title}` : 'Add Dokumen';
    }
  };

  useEffect(() => {
    return () => {
      hasSetInitialData.current = false;
      hasSetCategory.current = false;
    };
  }, []);

  return {
    debiturName,
    documentDetailData,
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
