'use client';

import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import { DocumentTypeRequestDtoDocumentGroupEnum } from '@/services/openapi/mip-service';

import useDeleteSummaryAttachment from '../../hooks/useDeleteSummaryAttachment';
import useGetListSummaryAttachment from '../../hooks/useGetListSummaryAttachment';

import { modal } from './FinancingDocumentDraftTable.constants';


export const useFinancingDocumentDraftTable = () => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data: attachmentListData, isLoading: attachmentListLoading } = useGetListSummaryAttachment({
    filter: {
      bucketProcessId: processId,
      documentGroup: DocumentTypeRequestDtoDocumentGroupEnum.FINANCINGDOCUMENT,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const { isPending: deleteAttachmentLoading, mutate: deleteAttachment } = useDeleteSummaryAttachment({
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil dihapus', type: 'success' });
    },
  });


  const attachmentListContents = attachmentListData?.contents.map((attachment) => {
    const {
      documentTypeLabel,
      documentName,
      documentNumber,
      documentDate,
      id,
      viewOnly,
    } = attachment;

    const documentType = {
      label: `${documentTypeLabel ?? '-'};${documentName ?? '-'};${documentNumber ? documentNumber : '-'};${documentDate ? formatDate(new Date(documentDate), 'DD MMMM YYYY') : '-'}`,
      value: id,
    };

    return {
      documentType,
      viewOnly,
    };
  });

  const attachmentListPage = attachmentListData?.page;


  const handleOpenAddModal = () => {
    NiceModal.show(modal.FINANCING_DOCUMENT_DRAFT);
  };

  const handleDeleteDraft = (id: number) => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onSubmit: () => deleteAttachment({
        id,
      }),
      title: 'Apakah anda yakin untuk menghapus data Document Pembiayaan?',
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
