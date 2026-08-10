import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useSearchParams } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFile } from '@/helpers/utils';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import useDeleteShareholder from '../../hooks/useDeleteShareholder';
import useGetShareholderList from '../../hooks/useGetShareholderList';
import { modalData } from '../../ManagementShareholder.constants';

import { tableHeaderList } from './TableShareholder.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ShareholderDto } from '@/services/openapi/master-service';


const useTableShareholder = () => {
  const { debtorId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { renderDetailLayout } = useMaintenanceDataContext();

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  useEffect(() => {
    setNoPage(1);
  }, [itemPerPage]);

  const params = useSearchParams();
  const isHaveFrom = params.get('from');


  const { data } = useGetShareholderList({
    filter: {
      debtorId: debtorId,
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  const { mutate: deleteShareholder } = useDeleteShareholder({
    onError: () => showNiceModalV2({
      title: 'Data gagal dihapus',
      type: 'error',
    }),
    onSuccess: () => showNiceModalV2({
      title: 'Data berhasil dihapus',
      type: 'success',
    }),
  });

  function handleDetailShareholder(payload: any) {
    const id = payload.id;

    if (isHaveFrom) {
      NiceModal.show(modalData.MODAL_SHAREHOLDER_DETAIL_NEW, { id });
    } else {
      NiceModal.show(modalData.MODAL_SHAREHOLDER_DETAIL_EXISTING, { id });
    }
  };

  const handleAddShareholder = () => {
    if (isHaveFrom) {
      NiceModal.show(modalData.MODAL_SHAREHOLDER_EXISTING);
    } else {
      NiceModal.show(modalData.MODAL_SHAREHOLDER_NEW);
    }
  };

  const handleEditShareholder = (payload: any) => {
    if (isHaveFrom || (!isHaveFrom && !renderDetailLayout && payload?.id)) {
      NiceModal.show(modalData.MODAL_SHAREHOLDER_EXISTING, { ...payload });
    } else {
      NiceModal.show(modalData.MODAL_SHAREHOLDER_NEW, { ...payload });
    }
  };


  function handleDeleteShareholder(props: ShareholderDto) {

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteShareholder({ id: props.id }),
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data ini?',
      type: 'warning',
    });
  };

  const tableHeader: Array<TableHeader> = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [{
        iconName: 'detail',
        onClick: (props: ShareholderDto) => handleDetailShareholder(props),
      },
      { iconName: 'preview-document',
        isDisabled: (props: ShareholderDto) => props.listDocuments.length < 1,
        onClick: (data) =>
          window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
      },
      {
        iconName: 'download',
        isDisabled: (props: ShareholderDto) => props.listDocuments.length < 1,
        onClick: (props: ShareholderDto) =>
          props?.listDocuments?.map((dt) =>
            downloadFile(dt.document, dt.fileName)),
      },
      {
        iconName: 'edit',
        isDisabled: viewOnly,
        onClick: (props: ShareholderDto) => handleEditShareholder(props),
      },
      {
        iconName: 'delete',
        isDisabled: viewOnly,
        onClick: (props: ShareholderDto) => handleDeleteShareholder(props),
      }],
      sx: { minWidth: '12vw' },
      type: 'action',
    }
  ];


  return {
    data,
    handleAddShareholder,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
    viewOnly,
  };
};

export default useTableShareholder;
