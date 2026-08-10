import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useSearchParams } from 'next/navigation';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFile } from '@/helpers/utils';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


import useDeleteManagement from '../../hooks/useDeleteManagement';
import useGetManagementList from '../../hooks/useGetManagementList';
import { modalData } from '../../ManagementShareholder.constants';

import { tableHeaderList } from './TableManagement.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ManagementDto } from '@/services/openapi/master-service';


const useTableManagement = () => {
  const { viewOnly } = useViewOnly();
  const { debtorId } = useIdentity();

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  useEffect(() => {
    setNoPage(1);
  }, [itemPerPage]);

  const params = useSearchParams();
  const isHaveFrom = params.get('from');

  const { data, isLoading } = useGetManagementList({
    filter: {
      debtorId,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  const { mutate: deleteManagement } = useDeleteManagement({
    onError: () => showNiceModalV2({
      title: 'Data gagal dihapus',
      type: 'error',
    }),
    onSuccess: () => showNiceModalV2({
      title: 'Data berhasil dihapus',
      type: 'success',
    }),
  });


  const handleDetailManagement = (props: ManagementDto) => {
    if (isHaveFrom) {
      NiceModal.show(modalData.MODAL_MANAGEMENT_DETAIL_NEW, { id: props.id });
    } else {
      NiceModal.show(modalData.MODAL_MANAGEMENT_DETAIL_EXISTING, { id: props.id });
    }
  };

  const handleEditManagement = (props: ManagementDto) => {
    NiceModal.show(modalData.MODAL_MANAGEMENT_EXISTING, { id: props.id });
  };

  const handleDeleteManagement = (props: ManagementDto) => {


    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteManagement({ id: props.id }),
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
        onClick: (props: ManagementDto) => handleDetailManagement(props),
      },
      { iconName: 'preview-document',
        isDisabled: (props) => props.listDocuments?.length < 1,
        onClick: (data) =>
          window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
      },
      {
        iconName: 'download',
        isDisabled: (props) => props.listDocuments?.length < 1,
        onClick: (props) =>
          props?.listDocuments?.map((dt) =>
            downloadFile(dt.document, dt.fileName)),
      },
      {
        iconName: 'edit',
        isDisabled: viewOnly,
        onClick: (props: ManagementDto) => handleEditManagement(props),
      },
      {
        iconName: 'delete',
        isDisabled: viewOnly,
        onClick: (props: ManagementDto) => handleDeleteManagement(props),
      }],
      sx: { minWidth: '12vw' },
      type: 'action',
    }
  ];

  const handleAddData = () => {
    if (isHaveFrom) {
      NiceModal.show(modalData.MODAL_MANAGEMENT_EXISTING);
    } else {
      NiceModal.show(modalData.MODAL_MANAGEMENT_NEW);
    }
  };


  return {
    data,
    handleAddData,
    isLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
    viewOnly,
  };

};

export default useTableManagement;
