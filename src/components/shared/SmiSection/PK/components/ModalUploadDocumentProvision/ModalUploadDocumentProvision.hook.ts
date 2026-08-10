import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import blobToBase64 from '@/helpers/imageToBase64';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { MODALPK } from '../../PK.constants';

import useDetailDocumentGroup from './hooks/useDetailDocumentGroup';
import useAddDocument from './hooks/useSaveDocumentProvision';
import { formData, validation } from './ModalUploadDocumenPrivision.form';
import { documentCategoryDropdownList } from './ModalUploadDocumentProvision.constants';

import type { ModalUploadDocumentProps } from './ModalUploadDocumentProvision.types';


const useModalUploadDocumentPrivision = ({
  docParent,
  process,
  module,
  id,
  isDetailDisabled,
}: ModalUploadDocumentProps) => {
  const { childId } = useIdentity();
  const queryClient = useQueryClient();
  const modalId = MODALPK.MODAL_DOCUMENT_PROVISION;
  const { debiturName } = useIdentity();
  console.log(debiturName);

  const {
    masintonForm,
    masintonChange,
    masintonMultiChange,
    masintonValidation,
    masintonSubmit,
    masintonReset,
    masintonMagic,
  } = useMasintonForm(formData, validation);

  const {
    documentCategory: { value: documentCategory },
    documentGroup: { value: documentGroup },
    document: { value: document },
    documentType: { value: documentType },
    documentNumber: { value: documentNumber },
    documentDate: { value: documentDate },
    description: { value: description },
    documentParent: { value: documentParent },
  } = masintonForm;

  const { data: documentGroupData, isFetching: isFetchDocumentGroupLoading } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: documentCategory?.value,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentTypeName',
        value: '',
      },
    },
    { enabled: !!documentCategory }
  );

  const { data: documentTypeData, isFetching: isFetchDocumentTypeLoading } = useGetParameterDocumentType(
    {
      filter: {
        documentGroupCode: documentGroup?.value,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentGroupName',
        value: '',
      },
    },
    { enabled: !!documentGroup?.value }
  );

  const { mutate: saveDocument, isPending: isSaveLoading } = useAddDocument({
    onError: () => showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' }),
    onSuccess: (res) => {
      masintonReset();
      queryClient.invalidateQueries({ queryKey: ['document-group-all-pk', {
        bucketProcessId: childId }]});
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(modalId);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const {
    data: documentDetailData,
    isSuccess: isDocumentDetailSuccess,
  } = useDetailDocumentGroup(
    {
      id,
    },
    {
      enabled: id !== undefined && id !== null,
    }
  );


  useEffect(() => {
    const {
      documentExtension,
      document,
      documentGroupLabel,
      documentGroup,
      documentType,
      documentTypeLabel,
      documentName,
      documentParent,
      documentCategory,
    } = documentDetailData || {};

    if (documentDetailData && isDocumentDetailSuccess) {
      const newData = structuredClone(documentDetailData);
      const data = Object.assign(newData, {
        document: document ? {
          extension: `.${documentExtension}`,
          name: documentName,
          url: document,
        } : null,
        documentCategory: {
          label: documentCategory === 'FINANCING_DOCUMENT' ? 'Document Pembiayaan' : 'Supporting Document',
          value: documentCategory,
        },

        documentGroup: {
          label: documentGroupLabel,
          value: documentGroup,
        },
        documentParent: documentParent,
        documentType: {
          label: documentTypeLabel,
          value: documentType,
        },
      });
      masintonMagic(data ?? {});
    }

  }, [documentDetailData, isDocumentDetailSuccess]);

  const isEdit = Boolean(id);
  const handleOnEdit = async (oldDoc: string, newDoc: string) => {
    if (isEdit && oldDoc === newDoc) {
      return null;
    }
    if (document?.file) {
      const base64 = await blobToBase64(document.file);
      return base64;
    }
    return null;
  };

  const handleSave = async () => {
    if (!masintonValidation()) return;
    const documentBase64 = await handleOnEdit(documentDetailData?.document, document?.url);
    const payload = Object.assign(masintonSubmit(), {
      bucketProcessId: String(childId),
      description: description,
      document: documentBase64,
      documentCategory: documentCategory.value,
      documentDate: documentDate,
      documentExtension: document.extension.replace('.', ''),
      documentGroup: documentGroup?.value,
      documentName: document.name,
      documentNumber: documentNumber,
      documentParent: docParent ?? documentParent,
      documentType: documentType?.value,
      fileName: `${documentType?.label}_${debiturName}_${documentNumber}_${dayjs(documentDate).format('DDMMYYYY')}`,
      id,
      module,
      process,
    });
    saveDocument(payload as any);
  };

  const documentGroupDataList = documentGroupData && documentGroupData?.map((res) => ({
    label: res?.label,
    value: res?.id,
  }));
  const documentTypeDataList = documentTypeData && documentTypeData?.map((res) => ({
    label: res?.label,
    value: res?.id,
  }));

  return {
    documentCategoryDropdownList,
    documentGroupDataList,
    documentTypeDataList,
    handleSave,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isSaveLoading,
    masintonChange,
    masintonForm,
    masintonMultiChange,
  };
};

export default useModalUploadDocumentPrivision;
