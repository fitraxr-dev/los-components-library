import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { dayJsJakartaKeep } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAddDocument from '@/hooks/services/useAddDocument';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { formData, validation } from './ModalVerificationUploadDocument.form';

import type { ModalVerificationUploadDocumentProps } from './ModalVerificationUploadDocument.types';


const useModalVerificationUploadDocument = ({
  documentParent,
  ownerId,
  ownership,
  process,
  module,
}: ModalVerificationUploadDocumentProps) => {
  const { processId, debiturName } = useIdentity();
  const queryClient = useQueryClient();

  const [keywordDocumentGroup, setKeyworDocumentGroup] = useState('');
  const [keywordDocumentType, setKeyworDocumentType] = useState('');

  const {
    masintonForm,
    masintonChange,
    masintonMultiChange,
    masintonValidation,
    masintonSubmit,
    masintonReset,
  } = useMasintonForm(formData, validation);

  const {
    documentCategory: { value: documentCategory },
    documentGroup: { value: documentGroup },
    document: { value: document },
    documentType: { value: documentType },
    documentNumber: { value: documentNumber },
    documentDate: { value: documentDate },
  } = masintonForm;

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
      queryClient.invalidateQueries({ queryKey: ['documents']});
      masintonReset();
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const formatDocumentParent = () => {
    let formatDoc = documentParent;
    if (typeof documentParent === 'object') {
      formatDoc = documentCategory?.id;
    }
    return formatDoc;
  };

  const handleSave = () => {

    const isFormValid = masintonValidation();

    if (!isFormValid) {
      return;
    }

    if (!Array.isArray(document) || document.length === 0) {
      showNiceModalV2({
        title: 'Harap unggah minimal satu dokumen',
        type: 'error',
      });
      return;
    }


    const formPayload = masintonSubmit();

    if (formPayload.documentName) {
      delete formPayload.documentName;
    }

    // Iterasi all uploded file
    document.forEach((fileItem, index) => {
      const payload = {
        ...formPayload,
        bucketProcessId: String(processId),
        document: fileItem?.file,
        documentDate: dayJsJakartaKeep(documentDate),
        documentExtension: fileItem?.extension?.replace('.', ''),
        documentGroup: documentGroup?.id,
        documentName: fileItem?.name,
        documentParent,
        documentType: documentType?.id,
        fileName: `${documentType?.label}_${debiturName}_${documentNumber}_${dayjs(documentDate).format('DDMMYYYY')}`,
        module,
        ownerId,
        ownership,
        process,
      };

      saveDocument(payload);
    });
  };

  // const handleSave = () => {
  //   if (!masintonValidation()) return;

  //   const payload = Object.assign(masintonSubmit(), {
  //     bucketProcessId: String(processId),
  //     document: document.file,
  //     documentExtension: document.extension?.replace('.', ''),
  //     documentGroup: documentGroup?.id,
  //     documentParent,
  //     documentType: documentType?.id,
  //     fileName: `${documentType?.label}_${debiturName}_${documentNumber}_${dayjs(documentDate).format('DDMMYYYY')}`,
  //     module,
  //     ownerId,
  //     ownership,
  //     process,
  //   });

  //   saveDocument(payload);
  // };

  return {
    debiturName,
    documentGroupData,
    documentTypeData,
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

export default useModalVerificationUploadDocument;
