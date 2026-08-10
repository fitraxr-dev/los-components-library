'use client';
import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import { ListProposalAttachmentRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import useDeleteAttachment from '@/components/shared/SmiTable/DraftMemo/hooks/useDeleteAttachment';
import useGetAttachmentList from '@/components/shared/SmiTable/DraftMemo/hooks/useGetAttachmentList';

import { modal } from './TableDraftMemoSupportingDocument.constants';

import type { TableDraftMemoSupportingDocumentProps } from './TableDraftMemoSupportingDocument.types';


export const useTableDraftMemoSupportingDocument = (props: TableDraftMemoSupportingDocumentProps) => {
  const { processId } = useIdentity();
  const { id } = props;
  const childId = id;

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data: attachmentListData, isLoading: attachmenListLoading } = useGetAttachmentList({
    filter: {
      bucketProcessId: !!childId && props.process === TypeProcess.PROCESSING_TYPE_PK ? childId : processId,
      documentParent: ListProposalAttachmentRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const { isPending: deleteAttachmentLoading, mutate: deleteAttachment } = useDeleteAttachment({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const attachmentListContents = attachmentListData?.contents.map((attachment) => {
    const {
      // documentTypeLabel,
      documentName,
      // documentNumber,
      // documentDate,
      fileName,
      id,
      viewOnly,
    } = attachment;

    const documentType = {
      documentId: attachment.documentId,
      // diSimpen buat sewaktu waktu berubah permintaan qa riris & adit ba 01-16-2025
      // label: `${documentTypeLabel ?? '-'};${documentName ?? '-'};
      // ${documentNumber ? documentNumber : '-'};${documentDate ?
      // formatDate(new Date(documentDate), 'DD MMMM YYYY') : '-'}`,
      label: fileName,
      value: id,
    };

    return {
      documentType,
      viewOnly,
    };
  });

  const attachmentListPage = attachmentListData?.page;

  const handleOpenAddModal = () => {
    NiceModal.show(modal.SUPPORTING_DOCUMENT_DRAFT_MODAL, {
      ...props,
      blacklist: attachmentListContents.map((obj) => obj.documentType),
    });
  };

  const handleDeleteDraft = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteAttachment({
        bucketProcessId: !!childId && props.process === TypeProcess.PROCESSING_TYPE_PK ? childId : processId,
        documentParent: ListProposalAttachmentRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT,
        payload: {
          id,
        },
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk menghapus data Supporting Document?',
      type: 'warning',
    });
  };

  return {
    attachmenListLoading,
    attachmentListContents,
    attachmentListPage,
    deleteAttachmentLoading,
    handleDeleteDraft,
    handleOpenAddModal,
    noPage,
    setItemPerPage,
    setNoPage,
  };
};
