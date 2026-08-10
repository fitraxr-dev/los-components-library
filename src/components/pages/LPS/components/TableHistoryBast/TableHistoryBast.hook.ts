import * as React from 'react';
import { useState } from 'react';

import { show } from '@ebay/nice-modal-react';

import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useDownloadGeneral from '@/hooks/useDownloadGeneral';
import useIdentity from '@/hooks/useIdentity';


import useRetryGenerateDraftMemo from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory/hooks/useRetryGenerateDraftMemo';

import useDeleteHistoryDraftMemo from './hooks/useDeleteHistoryDraftMemo';
import useDownloadDraftMemo from './hooks/useDownloadDraftMemo';
import useGetHistoryDraftMemoList from './hooks/useGetHistoryDraftMemoList';
import { modal } from './TableHistoryBast.constants';

import type { TableHistoryBastProps } from './TableHistoryBast.types';


export const useTableHistoryBast = ({ module, process, id }: TableHistoryBastProps) => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [documentName, setFileName] = useState();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every 10 seconds to refresh retry button visibility
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const downloadMutation = useDownloadGeneral({
    onError: (error) => {
      showNiceModalV2({
        title: 'Download gagal',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Download berhasil',
        type: 'success',
      });
    },
  });

  const handleDownload = (id: number, fileName?: string) => {
    downloadMutation.mutate({ fileName, id });
  };

  const { mutate: downloadDraftMemo } = useDownloadDraftMemo({
    onSuccess: (data) => handleFileDownload(data),
  });

  const handleFileDownload = async (data) => {
    try {
      await downloadBinaryPdf(data, documentName);
      showSuccessModal('Berhasil Download Memo');
    } catch (error) {
      console.error('Error during file download:', error);
    }
  };

  const downloadBinaryPdf = (inputData, fileName) => {
    try {

      const blob = new Blob([inputData.data], { type: inputData.headers['content-type'] });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      showNiceModalV2({
        title: `Gagal mengunduh file ${fileName}`,
        type: 'error',
      });
    }
  };

  const handleDownloadMemo = (data) => {

    if (data.type === 'MANUAL') {
      setFileName(data.documentName);
      handleDownload(data?.id, data.fileName);
    } else {
      setFileName(data.fileName);
      handleDownload(data?.id, data.fileName);
      // downloadDraftMemo({
      //   bucketProcessId: processId,
      //   file: data.fileUrl,
      //   fileExtension: data.fileExtension,
      //   module,
      //   process,
      // });
    }
  };

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
      title: 'Apakah anda yakin untuk mencoba generate ulang BAST ini?',
      type: 'warning',
    });
  };

  const { data: draftMemoData, isLoading: draftMemoLoading } = useGetHistoryDraftMemoList({
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

  const { isPending: deleteLoading, mutate: deleteDraftMemo } = useDeleteHistoryDraftMemo({
    onSuccess: () => {
      showSuccessModal('Data berhasil dihapus');
    },
  });

  const draftMemoList = React.useMemo(() => {
    const contents = (draftMemoData as any)?.contents;
    if (!contents) return undefined;

    return contents.map((draft) => {
      const createdAt = draft.createdAt ? new Date(draft.createdAt) : null;
      // Use currentTime state instead of new Date() to ensure re-calculation every 10 seconds
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

  const showSuccessModal = (title) => {
    showNiceModalV2({
      title,
      type: 'success',
    });
  };

  return {
    deleteLoading,
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
