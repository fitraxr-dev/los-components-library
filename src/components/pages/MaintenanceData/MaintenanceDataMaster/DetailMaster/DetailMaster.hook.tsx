import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';
import useViewOnly from '@/hooks/useViewOnly';

import { HEADER_TABLE, modal } from './DetailMaster.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDetailMaster = () => {
  const router = useCustomRouter();
  const [{ currentRole }] = useApp();
  const { setDebtorId } = useIdentity();
  const { setViewOnly } = useViewOnly();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isEditing, setIsEditing] = useState(false);

  // const { data, isLoading } = useGetBucketList({
  //   filter: {
  //     module: 'MAINTENANCE_DEBTOR',
  //     process: 'MAINTENANCE_DEBTOR',
  //   },
  //   page: {
  //     itemPerPage,
  //     noPage,
  //   },
  // });

  // useEffect(() => {
  //   if (data && !isLoading) {
  //     setContentList(data?.contents);
  //     setNoPage(data?.page?.noPage);
  //     setItemPerPage(data?.page?.itemPerPage);
  //   }
  // }, [data, isLoading]);


  const tableHeader: TableHeader[] = [
    ...HEADER_TABLE,
    {
      key: 'action',
      label: 'Action',
      options: !isEditing ?
        [
          {
            iconName: 'detail',
            onClick: (data) => {
              NiceModal.show(modal.DETAIL_MODAL, { data: createDetailObject(data), title: 'Detail LOV' });
            },
          },
        ] : [
          {
            iconName: 'edit',
            onClick: (data) => {NiceModal.show(modal.ADD_REQUEST_FORM, { data: data, title: 'Edit' });},
          },
          {
            iconName: 'delete',
            onClick: (data) => {handleDeleteData(data?.id);},
          },
        ],
      type: 'action',
    },
  ];

  const createDetailObject = (data) => {
    return [
      {
        label: 'LOV ID',
        value: data.idLov,
      },
      {
        label: 'Deskripsi',
        value: data.description,
      },
      {
        label: 'ARIUM CODE',
        value: data.ariumCode,
      },
      {
        label: 'TEMENOS CODE',
        value: data.temenosCode,
      },
      {
        label: 'Active',
        value: data.active,
      },
    ];
  };

  const handleSaveEdit = () => {

  };

  const handleOpenAddModal = () => {
    NiceModal.show(modal.ADD_REQUEST_FORM, { title: 'Add' });
  };

  const handleDeleteData = (id: any) => {

  };

  return {
    data: { contents: [], page: { totalPage: 0 } }, //dummy
    handleOpenAddModal,
    handleSaveEdit,
    isEditing,
    isLoading: false, //dummy
    page,
    pageSize,
    setIsEditing,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useDetailMaster;
