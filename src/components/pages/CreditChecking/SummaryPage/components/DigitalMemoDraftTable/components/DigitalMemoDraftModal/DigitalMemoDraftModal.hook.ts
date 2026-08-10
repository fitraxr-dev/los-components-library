import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import {
  DocumentTypeRequestDtoDocumentGroupEnum,
  ProposalAttachmentDtoDocumentGroupEnum,
} from '@/services/openapi/mip-service';

import useGetDocumentGroup from '../../../../hooks/useGetDocumentGroup';
import useSaveAttachment from '../../../../hooks/useSaveAttachment';
import { modal } from '../../DigitmalMemoDraftTable.contants';

import type { BaseResponseGenericBucketResponseDtoDocumentCreationResponseDto } from '@/services/openapi/mip-service';


export const useDigitalMemoDraftModal = () => {
  const { processId } = useIdentity();
  const modalId = modal.DIGITAL_MEMO_DRAFT;


  const { data, isLoading } = useGetDocumentGroup({
    bucketProcessId: processId,
    documentGroup: DocumentTypeRequestDtoDocumentGroupEnum.DIGITALMEMO,
  });

  const { isPending: saveAttachmentLoading, mutate: saveAttachment } = useSaveAttachment({
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
      closeNiceModal(modalId);
    },
  });

  const getDropdownList = (data: BaseResponseGenericBucketResponseDtoDocumentCreationResponseDto) => {
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
    const attachments = data.digitalMemo.map((item) => item.documentType);

    saveAttachment({
      attachments,
      bucketProcessId: processId,
      documentGroup: ProposalAttachmentDtoDocumentGroupEnum.DIGITALMEMO,
    });
  };

  return {
    documentTypeDropdownList,
    handleOnSave,
    saveAttachmentLoading,
  };
};
