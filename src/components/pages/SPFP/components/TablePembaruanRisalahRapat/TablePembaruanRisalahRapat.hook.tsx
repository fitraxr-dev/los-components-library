import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';


import { TypeModule, TypeProcess } from '@/enums/Module';
import { API } from '@/helpers/api';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { getHoursMinutes } from '@/helpers/utils';
import useIdentity from '@/hooks/useIdentity';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import useGetRisalahRapatMerged from './hooks/useGetRisalahRapatMerged';
import useGetRisalahRapatRenewal from './hooks/useGetRisalahRapatRenewal';
import { modal } from './TablePembaruanRisalahRapat.constants';

import type { TablePembaruanRisalahRapatProps } from './TablePembaruanRisalahRapat.types';


export const useTablePembaruanRisalahRapat = (props: TablePembaruanRisalahRapatProps) => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const bucket = useSpfpBucketContext();
  const queryClient = useQueryClient();

  // const { data: risalahRapatData, isLoading: risalahRapatLoading } = useGetRisalahRapatMerged({
  //   filter: {
  //     bucketProcessId: bucket?.bucketProcessId,
  //     module: bucket?.module || props.module,
  //     ownership: 'RISALAH_RAPAT_MERGED',
  //     process: bucket?.process || props.process,
  //   },
  //   page: {
  //     itemPerPage: itemPerPage,
  //     noPage: noPage,
  //   },
  // });

  const { data: risalahRapatData, isLoading: risalahRapatLoading } = useGetRisalahRapatRenewal({
    filter: {
      bucketProcessId: bucket?.bucketProcessId,
      module: 'SPFP',
      process: 'SPFP',
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
  });

  const { isPending: isDeleteLoading, mutate: deleteRisalahRapat } = useMutation({
    mutationFn: async (payload: { bucketProcessId: string; documentId: number }) => {
      const res = await API('bucket.risalahRapat.reactivateDelete', {
        data: payload,
      });
      return res.data;
    },
    onError: (error: any) => {
      showNiceModalV2({
        title: error?.message || 'Data gagal dihapus',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risalah-rapat-merged']});
      // Invalidate check expired queries
      queryClient.invalidateQueries({ queryKey: ['risalah-rapat-check-expired']});
      queryClient.invalidateQueries({ queryKey: ['check-risalah-rapat-expired']});
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const risalahRapatContents = risalahRapatData?.contents;
  const risalahRapatPage = risalahRapatData?.page;

  const risalahRapatList = risalahRapatContents?.map((item) => ({
    ...item,
    documentDate: item.documentDate ? formatDate(new Date(item.documentDate), 'DD MMMM YYYY') : '-',
    documentName: item.documentName || item.fileName || '-',
    documentNumber: item.documentNumber ? item.documentNumber : '-',
    time: item.documentDate ? getHoursMinutes(item.documentDate) : (item.createdDate ? getHoursMinutes(item.createdDate) : '-'),
  }));


  const handleOpenAddModal = async () => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_RISALAH, {
      bucketProcessId: bucket?.bucketProcessId,
      documentParent: props.documentParent,
      module: bucket?.module || props.module,
      process: bucket?.process || props.process,
    });
  };

  const handleOpenEditModal = async (row: any) => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_RISALAH, {
      bucketProcessId: bucket?.bucketProcessId,
      documentId: row.id || row.documentId,
      documentParent: props.documentParent,
      initialData: {
        documentName: row.documentName,
        documentNumber: row.documentNumber,
      },
      isEdit: true,
      module: bucket?.module || props.module,
      process: bucket?.process || props.process,
    });
  };

  const handleOpenDeleteModal = async (row: any) => {
    const documentId = row.id || row.documentId;
    const bucketProcessId = bucket?.bucketProcessId || processId;

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteRisalahRapat({
        bucketProcessId,
        documentId,
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk menghapus dokumen ini?',
      type: 'warning',
    });
  };

  return {
    handleOpenAddModal,
    handleOpenDeleteModal,
    handleOpenEditModal,
    isDeleteLoading,
    noPage,
    risalahRapatList,
    risalahRapatLoading,
    risalahRapatPage,
    setItemPerPage,
    setNoPage,
  };
};
