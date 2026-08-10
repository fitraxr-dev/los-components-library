import { useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDocumentGroup from '@/hooks/services/bucket-document/document/useGetDocumentGroup';
import useSaveAttachment from '@/hooks/services/bucket-document/proposal/useSaveAttachment';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  ProposalAttachmentRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';


import { modal } from '../../TableDraftMemoDigital.constants';

import type { ModalDraftMemoDigitalProps } from './ModalDraftMemoDigital.types';


export const useModalDraftMemoDigital = ({ module, process, blacklist }: ModalDraftMemoDigitalProps) => {
  const { processId } = useIdentity();
  const queryClient = useQueryClient();
  const modalId = modal.DIGITAL_MEMO_DRAFT_MODAL;
  const selectedValueByIndex = useRef<{[key: number]: number}>({});

  const { data, isLoading } = useGetDocumentGroup({
    bucketProcessId: processId,
    documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO,
    module,
    process,
  });

  const { isPending: saveAttachmentLoading, mutate: saveAttachment } = useSaveAttachment({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachment-list']});

      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      closeNiceModal(modalId);
    },
  });

  const getDropdownList = (data: any) => {
    if (!isLoading && data?.data.contents) {
      const result = data.data.contents.map((item) => {
        const {
          // documentTypeLabel,
          documentName,
          fileName,
          // documentNumber,
          // documentDate,
        } = item;
        return {
          documentId: item.documentId,
          id: item.id,
          // diSimpen buat sewaktu waktu berubah permintaan qa riris & adit ba 01-16-2025
          // label: `${documentTypeLabel ?? '-'};${documentName ?? '-'};
          // ${documentNumber ? documentNumber : '-'};${documentDate ?
          // formatDate(new Date(documentDate), 'DD MMMM YYYY') : '-'}`,
          label: fileName,
          value: item.id,
        };
      });

      return result;
    }
  };

  const documentTypeDropdownList = getDropdownList(data);

  const getDropdownListFiltered = (row, index) => {
    const documentListBlacklistFiltered =
     documentTypeDropdownList?.filter(
       (obj) =>
         !blacklist?.some(
           (obj2) => obj2.documentId === obj.value
         )
     );
    if (!!documentTypeDropdownList) {
      const documentTypeDropdownListFiltered = documentListBlacklistFiltered.filter(
        (obj) => {
          const matchedObject = Object.values(selectedValueByIndex.current).find((val) => val === obj.value);
          if (!!matchedObject) {
            const matchedIdx =
           Object.keys(selectedValueByIndex.current).find((key) => selectedValueByIndex.current[key] === matchedObject);
            if (Number(matchedIdx) === index) return true;
            else return false;
          }
          return true;
        }
      );

      return documentTypeDropdownListFiltered;
    }
    return [];
  };

  const handleOnSave = (data) => {
    const attachments = data.digitalMemo.map((item) => item.documentType);

    saveAttachment({
      attachments,
      bucketProcessId: processId,
      documentParent: ProposalAttachmentRequestDtoDocumentParentEnum.DIGITALMEMO,
    });
  };

  return {
    data,
    documentTypeDropdownList,
    getDropdownListFiltered,
    handleOnSave,
    isLoading,
    saveAttachmentLoading,
    selectedValueByIndex,
  };
};
