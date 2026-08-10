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

import { modal } from './TableDraftMemoFinancingDocument.constants';

import type { TableDraftMemoFinancingDocumentProps } from './TableDraftMemoFinancingDocument.types';


export const useTableDraftMemoFinancingDocument = (props: TableDraftMemoFinancingDocumentProps) => {
  const { id } = props;
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const childProcessId = id;

  const { data: attachmentListData, isLoading: attachmentListLoading } = useGetAttachmentList({
    filter: {
      bucketProcessId: !!childProcessId && props.process === TypeProcess.PROCESSING_TYPE_PK
        ? childProcessId : processId,
      documentParent: ListProposalAttachmentRequestDtoDocumentParentEnum.FINANCINGDOCUMENT,
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
      fileName,
      // documentNumber,
      // documentDate,
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
    NiceModal.show(modal.FINANCING_DOCUMENT_DRAFT_MODAL, {
      ...props,
      blacklist: attachmentListContents.map((obj) => obj.documentType),
    });
  };

  const handleDeleteDraft = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteAttachment({
        bucketProcessId: !!childProcessId && props.process === TypeProcess.PROCESSING_TYPE_PK
          ? childProcessId : processId,
        documentParent: ListProposalAttachmentRequestDtoDocumentParentEnum.FINANCINGDOCUMENT,
        payload: {
          id,
        },
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk menghapus data Document Pembiayaan?',
      type: 'warning',
    });
  };

  return {
    attachmentListContents,
    attachmentListLoading,
    attachmentListPage,
    deleteAttachmentLoading,
    handleDeleteDraft,
    handleOpenAddModal,
    noPage,
    setItemPerPage,
    setNoPage,
  };
};
