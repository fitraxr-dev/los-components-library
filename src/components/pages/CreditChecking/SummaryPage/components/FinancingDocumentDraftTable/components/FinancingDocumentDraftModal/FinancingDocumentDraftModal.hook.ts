import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import { SummaryAttachmentRequestDtoDocumentGroupEnum } from '@/services/openapi/credit-checking-service';
import { DocumentTypeRequestDtoDocumentGroupEnum } from '@/services/openapi/mip-service';

import useGetDocumentGroup from '../../../../hooks/useGetDocumentGroup';
import useSaveSummaryAttachmentModify from '../../../../hooks/useSaveSummaryAttachmentModify';
import { modal } from '../../FinancingDocumentDraftTable.constants';


export const useFinancingDocumentDraftModal = () => {
  const { processId } = useIdentity();
  const modalId = modal.FINANCING_DOCUMENT_DRAFT;

  const { data, isLoading } = useGetDocumentGroup({
    filter: {
      bucketProcess: processId,
      documentGroup: DocumentTypeRequestDtoDocumentGroupEnum.FINANCINGDOCUMENT,
    },
    page: {
      itemPerPage: 100,
      noPage: 1,
    },
  });

  const { isPending: saveAttachmentLoading, mutate: saveAttachment } = useSaveSummaryAttachmentModify({
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const getDropdownList = (data) => {
    if (!isLoading && data?.data.contents) {
      const result = data.data.contents.map((item) => {
        const { documentTypeLabel, documentName, documentNumber, documentDate } = item;
        return {
          label: `${documentTypeLabel ?? '-'};${documentName ?? '-'};${documentNumber ? documentNumber : '-'};${documentDate ? formatDate(new Date(documentDate), 'DD MMMM YYYY') : '-'}
          `,
          value: item.id,
        };
      });

      return result;
    }
  };

  const documentTypeDropdownList = getDropdownList(data);

  const handleOnSave = (data) => {
    const attachments = data.financingDocument.map((item) => item.documentType);

    saveAttachment({
      attachments,
      bucketProcessId: processId,
      documentGroup: SummaryAttachmentRequestDtoDocumentGroupEnum.FINANCINGDOCUMENT,
    });
  };

  return {
    documentTypeDropdownList,
    handleOnSave,
    saveAttachmentLoading,
  };
};
