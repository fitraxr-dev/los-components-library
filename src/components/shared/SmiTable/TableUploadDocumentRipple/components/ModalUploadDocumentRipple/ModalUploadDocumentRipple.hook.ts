import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDocumentById from '@/hooks/services/useGetDocumentById';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import useSaveDocumentFile from '@/hooks/services/useSaveDocumentFile';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { modal } from '../../TableUploadDocumentRipple.constants';


import { documentCategoryDropdownList } from './ModalUploadDocumentRipple.constants';
import { formData, validation } from './ModalUploadDocumentRipple.form';

import type { AddEditModalDocumentProps } from '../../TableUploadDocumentRipple.types';


const useModalUploadDocument = (props: AddEditModalDocumentProps) => {
  const {
    process,
    module,
    id,
    type,
    documentParent,
    ownership,
    childId,
    rippleTo,
  } = props;

  const { processId, debiturName } = useIdentity();
  const [keywordDocumentGroup, setKeyworDocumentGroup] = useState('');
  const [keywordDocumentType, setKeyworDocumentType] = useState('');
  const path = usePathname();
  const isViewAllDocument = getLastPath(path) === 'view-all-document';

  const {
    masintonForm,
    masintonMultiChange,
    masintonChange,
    masintonValidation,
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

  let docParent = documentParent ?? documentCategory;


  const {
    data: documentDetailData,
    isSuccess: isDocumentDetailSuccess,
  } = useGetDocumentById(
    { id: +id }, { enabled: id !== undefined && id !== null });

  useEffect(() => {
    masintonChange('documentCategory', documentCategoryDropdownList.find((dt) => dt.id === type));
  }, []);


  useEffect(() => {
    const {
      documentExtension,
      document,
      fileName,
      documentGroupLabel,
      documentGroup,
      documentType,
      documentTypeLabel,
      documentCategory,
      documentCategoryLabel,
    } = documentDetailData || {};

    if (documentDetailData && isDocumentDetailSuccess) {
      const newData = structuredClone(documentDetailData);
      const data = Object.assign(newData, {
        document: document ? {
          extension: `.${documentExtension}`,
          name: fileName.split('.')?.[0],
          url: document,
        } : null,
        documentCategory: {
          id: documentCategory,
          label: documentCategoryLabel,
        },
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

  const { mutate: saveDocument, isPending: isSaveLoading } = useSaveDocumentFile({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(modal.MODAL_UPLOAD_DOCUMENT_RIPPLE);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const formatDocumentParent = () => {
    let formatDoc = documentCategory?.id;
    if (Boolean(docParent?.length)) {
      formatDoc = documentParent;
    }
    return formatDoc;
  };


  const handleSave = () => {
    if (!masintonValidation()) return;

    const payload = {
      bucketProcessId: childId ?? String(processId),
      document: document.file,
      documentCategory: documentCategory.id,
      documentExtension: document.extension.replace('.', ''),
      documentGroup: documentGroup?.id,
      documentParent: isViewAllDocument ? documentCategory.id : formatDocumentParent(),
      documentType: documentType?.id,
      fileName: `${documentType?.label}_${debiturName}_${documentNumber}_${dayjs(documentDate).format('DDMMYYYY')}`,
      id: +id,
      module,
      ownership: isViewAllDocument ? undefined : ownership,
      process,
      rippleTo,
    };
    console.log(payload, 'testing ini payload');
    saveDocument(payload as any);
  };

  console.log(rippleTo, 'ini rippleTo');

  const generateTitle = (id: number) => {
    if (id) {
      return 'Edit Dokumen';
    } else {
      return 'Add Dokumen';
    }
  };

  return {
    debiturName,
    documentGroupData,
    documentTypeData,
    generateTitle,
    handleSave,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isSaveLoading,
    isViewAllDocument,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
  };
};

export default useModalUploadDocument;
