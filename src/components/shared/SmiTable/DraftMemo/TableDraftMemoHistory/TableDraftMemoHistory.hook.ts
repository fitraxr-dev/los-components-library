import * as React from 'react';

import { show } from '@ebay/nice-modal-react';

import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';

import useDownloadDraftMemo from '../hooks/useDownloadDraftMemo';

import useDeleteHistoryDraftMemo from './hooks/useDeleteHistoryDraftMemo';
import useGetHistoryDraftMemoList from './hooks/useGetHistoryDraftMemoList';
import useRetryGenerateDraftMemo from './hooks/useRetryGenerateDraftMemo';
import { modal } from './TableDraftMemoHistory.constants';

import type { DraftMemoHistoryProps } from './TableDraftMemoHistory.types';


export const useTableDraftMemoHistory = ({ module, process, id }: DraftMemoHistoryProps) => {
  const { processId } = useIdentity();

  const [noPage, setNoPage] = React.useState(1);
  const [itemPerPage, setItemPerPage] = React.useState(5);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update current time every 10 seconds to refresh retry button visibility
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const { mutate: downloadDraftMemo, isPending: downloadLoading } = useDownloadDraftMemo({});

  const { data: draftMemoData, isLoading: draftMemoLoading } =
    useGetHistoryDraftMemoList({
      filter: {
        bucketProcessId: id ?? processId,
        module,
        process,
      },
      page: {
        itemPerPage,
        noPage,
      },
    });

  const { isPending: deleteLoading, mutate: deleteDraftMemo } =
    useDeleteHistoryDraftMemo({
      onSuccess: () => {
        showNiceModalV2({
          title: 'Data berhasil dihapus',
          type: 'success',
        });
      },
    });

  const { mutate: retryGenerateDraftMemo, isPending: retryLoading } = useRetryGenerateDraftMemo({
    onError: (data) => {
      const title = `${data?.response?.data?.errorDetail ?? 'Terjadi Kesalahan, Coba lagi nanti.'}`;
      showNiceModalV2({ title, type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({
        cancelText: 'Tutup',
        submitText: 'OK',
        title: 'Mohon Tunggu, Dokumen Sedang di Proses Maksimal 5 Menit',
        type: 'warning',
      });
    },
  });

  const downloadBinary = React.useCallback((resp: any, fileName?: string) => {
    try {
      const contentType = resp.headers?.['content-type'] ?? 'application/octet-stream';
      const blob = resp.data instanceof Blob
        ? resp.data
        : new Blob([resp.data], { type: contentType });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'download';
      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNiceModalV2({
        title: 'Download berhasil',
        type: 'success',
      });
    } catch (error) {

      console.error('Error during file download:', error);
      showNiceModalV2({
        title: `Gagal mengunduh file ${fileName || ''}`.trim(),
        type: 'error',
      });
    }
  }, []);

  const downloadFromUrl = React.useCallback(async (fileUrl: string, fileName?: string) => {
    try {
      const res = await fetch(fileUrl, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      downloadBinary({ data: blob, headers: { 'content-type': blob.type } }, fileName);
      return;
    } catch (e) {
      console.warn('Falling back to direct link due to fetch/CORS:', e);
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  }, [downloadBinary]);

  const handleDownloadMemo = React.useCallback((item: any) => {
    if (item.type === 'MANUAL') {
      if (!item.fileUrl) {
        showNiceModalV2({
          title: 'File URL tidak tersedia',
          type: 'error',
        });
        return;
      }

      const fileName = item.documentName || 'memo';
      void downloadFromUrl(item.fileUrl, fileName);
      return;
    }

    const fileName = item.fileName || item.documentName || 'memo';
    downloadDraftMemo({
      bucketProcessId: id ?? processId,
      file: item.fileUrl,
      fileExtension: item.fileExtension,
      module,
      process,
    }, {
      onError: () =>
        showNiceModalV2({
          title: `Gagal mengunduh file ${fileName}`,
          type: 'error',
        }),
      onSuccess: (data: any) => downloadBinary(data, fileName),
    });
  }, [downloadDraftMemo, downloadBinary, id, processId, module, process]);

  const draftMemoList = React.useMemo(() => {
    const contents = (draftMemoData as any)?.contents ;
    if (!contents) return undefined;

    return contents.map((draft) => {
      const createdAt = draft.createdAt ? new Date(draft.createdAt) : null;
      // Use currentTime state instead of new Date() to ensure re-calculation every 30 seconds
      const diffInMinutes = createdAt
        ? (currentTime.getTime() - createdAt.getTime()) / (1000 * 60)
        : 0;

      const shouldShowRetry =
        diffInMinutes > 2 && (
          draft.fileUrl === null || draft.isGenerated === false) &&
        draft.type === 'GENERATE_DRAFT';

      return {
        bucketMasterId: draft.bucketMasterId ?? null,
        createdBy: draft.createdBy ?? '-',
        createdDate: draft.createdAt
          ? formatDate(new Date(draft.createdAt), 'DD MMMM YYYY', {
            withSeconds: true,
            withTime: true,
          })
          : '-',
        documentDate: draft.documentDate
          ? formatDate(new Date(draft.documentDate), 'DD MMMM YYYY')
          : '-',
        documentName: draft.documentName ?? '-',
        fileExtension: draft.fileExtension ?? null,
        fileName: draft.fileName ?? null,
        fileUrl: draft.fileUrl ?? null,
        id: draft.id,
        isGenerated: draft.isGenerated ?? null,
        shouldShowRetry,
        type: draft.type ?? null,
        viewOnly: draft.viewOnly ?? null,
      };
    });
  }, [draftMemoData, currentTime]);

  const handleOpenAddModal = () => {
    show(modal.HISTORY_DRAFT_MEMO, { module, process });
  };

  const handleDeleteDraft = (id, documentName) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteDraftMemo({
        bucketProcessId: String(processId),
        payload: { id },
      }),
      submitText: 'Ya',
      title: `Apakah anda yakin untuk Menghapus data ${documentName} ?`,
      type: 'warning',
    });
  };

  const handleRetryGenerate = (data: any) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        retryGenerateDraftMemo({
          bucketMasterId: data.bucketMasterId,
          bucketProcessId: id ?? processId,
          id: data.id,
          module,
          process,
        });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk mencoba generate ulang draft memo ini?',
      type: 'warning',
    });
  };

  return {
    deleteLoading,
    downloadLoading,
    draftMemoList,
    draftMemoLoading,
    draftMemoPage: draftMemoData?.page,
    handleDeleteDraft,
    handleDownloadMemo,
    handleOpenAddModal,
    handleRetryGenerate,
    noPage,
    retryLoading,
    setItemPerPage,
    setNoPage,
  };
};
