import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import dayjs from 'dayjs';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAddDocument from '@/hooks/services/useAddDocument';
import useGetDocumentById from '@/hooks/services/useGetDocumentById';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { documentGroupDropdownList, documentTypeDropdownList, modal } from './ModalUploadDocument.constants';
import { formData, validation } from './ModalUploadDocument.form';

import type { ModalUploadDocumentProps } from './ModalUploadDocument.types';


const useModalUploadDocument = (props: ModalUploadDocumentProps) => {
  const {
    process,
    module,
    ownership,
    id,
    title,
    ownerId,
    documentParent,
  } = props;

  const { processId, debiturName } = useIdentity();
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
    documentNumber: { value: documentNumber },
    documentDate: { value: documentDate },

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
      documentGroup,
      documentType,
    } = documentDetailData || {};

    if (documentDetailData && isDocumentDetailSuccess) {
      const newData = structuredClone(documentDetailData);
      const data = Object.assign(newData, {
        document: document ? {
          extension: `.${documentExtension}`,
          name: fileName.split('.')?.[0],
          url: document,
        } : null,
        documentGroup: getDocumentVal(documentGroupDropdownList, documentGroup),
        documentType: getDocumentVal(documentTypeDropdownList, documentType),
      });
      masintonMagic(data ?? {});
    }
  }, [documentDetailData, isDocumentDetailSuccess]);


  const { mutate: saveDocument, isPending: isSaveLoading } = useAddDocument({
    onError: () => {
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(modal.MODAL_UPLOAD_DOCUMENT);
        },
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(modal.MODAL_UPLOAD_DOCUMENT);
        },
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
      documentDate: dayjs(documentDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      documentExtension: document.extension.replace('.', ''),
      documentGroup: documentGroup,
      documentParent,
      documentType: documentType,
      fileName: `${getDocumentTypeLabel(documentType)}_${debiturName}_${documentNumber}_${dayjs(documentDate).format('DDMMYYYY')}`,
      id,
      module,
      ownerId,
      ownership,
      process,
    });
    saveDocument(payload);
  };

  const getDocumentTypeLabel = (val: string) =>
    documentTypeDropdownList.find((item) => item?.value === val)?.label || null;

  // prepare ketika document Type/Group/Category List nya Bertambah
  const getDocumentVal = (list: { label: string; value: string }[], val: string) => {
    const valDoc = list.find((res) => res.value === val)?.value || '';
    return valDoc;
  };

  const generateTitle = (id: number) => {
    if (id) {
      return title ? `Edit ${title}` : 'Edit Dokumen';
    } else {
      return title ? `Add ${title}` : 'Add Dokumen';
    }
  };

  return {
    debiturName,
    generateTitle,
    getDocumentTypeLabel,
    handleSave,
    isSaveLoading,
    masintonChange,
    masintonForm,
    masintonMultiChange,
  };
};

export default useModalUploadDocument;
