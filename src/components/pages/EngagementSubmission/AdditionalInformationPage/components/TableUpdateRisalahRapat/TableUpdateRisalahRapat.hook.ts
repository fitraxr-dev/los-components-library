import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { getHoursMinutes } from '@/helpers/utils';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useIdentity from '@/hooks/useIdentity';

import useGetRisalahRapatMerged from './hooks/useGetRisalahRapatMerged';
import { modal } from './TableUpdateRisalahRapat.constants';


export const useTableUpdateRisalahRapat = () => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data: risalahRapatData, isLoading: risalahRapatLoading } = useGetRisalahRapatMerged({
    filter: {
      bucketProcessId: processId,
      documentCategory: 'DIGITAL_MEMO',
      documentParent: 'DIGITAL_MEMO',
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      ownership: 'RISALAH_RAPAT_MERGED',
      process: TypeProcess.ENGAGEMENT_AGREEMENT,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
  });

  const { isPending: isDeleteLoading, mutate: deleteDocument } = useDeleteDocument({
    onSuccess: () => {
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
      bucketProcessId: processId,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.ENGAGEMENT_AGREEMENT,
    });
  };

  const handleOpenDeleteModal = async (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteDocument({
        bucketProcessId: processId,
        payload: {
          id,
        },
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk menghapus dokumen ini?',
      type: 'warning',
    });
  };

  return {
    handleOpenAddModal,
    handleOpenDeleteModal,
    isDeleteLoading,
    noPage,
    risalahRapatList,
    risalahRapatLoading,
    risalahRapatPage,
    setItemPerPage,
    setNoPage,
  };
};
