import { useRef } from 'react';

import { TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  ProposalAttachmentRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';

import useGetDocumentGroup from '@/components/shared/SmiTable/DraftMemo/hooks/useGetDocumentGroup';
import useSaveAttachment from '@/components/shared/SmiTable/DraftMemo/hooks/useSaveAttachment';

import { modal } from '../../TableDraftMemoFinancingDocument.constants';

import type { ModalDraftMemoFinancingDocumentProps } from './ModalDraftMemoFinancingDocument.types';
import type {
  BaseResponseGenericBucketResponseDtoDocumentCreationResponseDto,
} from '@/services/openapi/bucket-document-service';


export const useModalDraftMemoFinancingDocument = ({
  module,
  process,
  id,
  blacklist,
}: ModalDraftMemoFinancingDocumentProps) => {
  const { processId } = useIdentity();
  const childProcessId = id;
  const modalId = modal.FINANCING_DOCUMENT_DRAFT_MODAL;
  const selectedValueByIndex = useRef<{[key: number]: number}>({});

  const { data, isLoading } = useGetDocumentGroup({
    bucketProcessId: !!childProcessId ? childProcessId : processId,
    documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT,
    module,
    process,
  });


  const { isPending: saveAttachmentLoading, mutate: saveAttachment } = useSaveAttachment({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      closeNiceModal(modalId);
    },
  });

  const getDropdownList = (data: BaseResponseGenericBucketResponseDtoDocumentCreationResponseDto) => {
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
    const attachments = data.financingDocument.map((item) => item.documentType);

    saveAttachment({
      attachments,
      bucketProcessId: !!childProcessId && process === TypeProcess.PROCESSING_TYPE_PK ? childProcessId : processId,
      documentParent: ProposalAttachmentRequestDtoDocumentParentEnum.FINANCINGDOCUMENT,
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
