import { useState } from 'react';

import NiceModal, { show } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';

import useDeleteHistoryDraftMemo from './hooks/useDeleteHistoryDraftMemo';
import useGetHistoryDraftMemoList from './hooks/useGetHistoryDraftMemoList';


export const useHistoryDraftMemoTable = () => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);


  const { data: draftMemoData, isLoading: draftMemoLoading } = useGetHistoryDraftMemoList({
    filter: {
      bucketProcessId: processId,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const { isPending: deleteLoading, mutate: deleteDraftMemo } = useDeleteHistoryDraftMemo({
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil dihapus', type: 'success' });
    },
  });

  const draftMemoContents = draftMemoData?.contents;
  const draftMemoPage = draftMemoData?.page;

  const draftMemoList = draftMemoContents?.map((draft) => ({
    createdBy: draft.createdBy ?? '-',
    createdDate: draft.createdAt ? formatDate(new Date(draft.createdAt), 'DD MMMM YYYY') : '-',
    documentDate: draft.documentDate ? formatDate(new Date(draft.documentDate), 'DD MMMM YYYY') : '-',
    documentName: draft.documentName ?? '-',
    fileName: draft.fileName,
    fileUrl: draft.fileUrl,
    id: draft.id,
    type: draft.type,
    viewOnly: draft.viewOnly,
  }));

  const handleOpenAddModal = () => {
    show(MODAL.PROPOSAL.HISTORY_DRAFT_MEMO);
  };

  const handleDeleteDraft = (id: number) => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onSubmit: () => deleteDraftMemo({
        bucketProcessId: processId,
        payload: {
          id,
        },
      }),
      title: 'Apakah anda yakin untuk Menghapus data Draft Memo?',
    });
  };

  return {
    deleteLoading,
    draftMemoList,
    draftMemoLoading,
    draftMemoPage,
    handleDeleteDraft,
    handleOpenAddModal,
    noPage,
    setItemPerPage,
    setNoPage,
  };
};
