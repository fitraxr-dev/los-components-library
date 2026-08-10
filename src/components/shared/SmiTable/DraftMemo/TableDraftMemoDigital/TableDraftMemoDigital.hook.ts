'use client';
import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useDeleteAttachment from '@/hooks/services/bucket-document/proposal/useDeleteAttachment';
import useGetAttachmentList from '@/hooks/services/bucket-document/proposal/useGetAttachmentList';
import useIdentity from '@/hooks/useIdentity';
import { ListProposalAttachmentRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


import { modal } from './TableDraftMemoDigital.constants';

import type { TableDraftMemoDigitalProps } from './TableDraftMemoDigital.types';


export const useTableDraftMemoDigital = (props: TableDraftMemoDigitalProps) => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data: attachmentListData, isLoading: attachmenListLoading } = useGetAttachmentList({
    filter: {
      bucketProcessId: processId,
      documentParent: ListProposalAttachmentRequestDtoDocumentParentEnum.DIGITALMEMO,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const { data: allAttachmentListData } = useGetAttachmentList({
    filter: {
      bucketProcessId: processId,
      documentParent: ListProposalAttachmentRequestDtoDocumentParentEnum.DIGITALMEMO,
    },
    page: {
      itemPerPage: 99999,
      noPage: 1,
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

  const blacklistContents = allAttachmentListData?.contents?.map((attachment) => ({
    documentId: attachment.documentId,
    label: attachment.fileName,
    value: attachment.id,
  })) ?? [];

  const handleOpenAddModal = () => {
    NiceModal.show(modal.DIGITAL_MEMO_DRAFT_MODAL, {
      ...props,
      blacklist: blacklistContents,
    });
  };

  const handleDeleteDraft = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteAttachment({
        id,
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk menghapus data Digital Memo?',
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
