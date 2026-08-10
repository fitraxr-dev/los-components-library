import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { TypeModule } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useDeleteBusinessGroup from '@/hooks/services/bucket/debtor/useDeleteBusinessGroup';
import useGetBusinessGroup from '@/hooks/services/bucket/debtor/useGetBusinessGroup';
import useGetBusinessGroupSelected from '@/hooks/services/bucket/debtor/useGetBusinessGroupSelected';
import useSaveBusinessGroup from '@/hooks/services/bucket/debtor/useSaveBusinessGroup';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import Input from '@/components/shared/Input';


import { modal } from '../../DebtorInformation.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useBusinessGroup = () => {
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const { processId, debtorId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const { typeProcess } = useAnnualReviewContext();

  const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetBusinessGroupSelected({
    filter: {
      bucketProcessId: processId,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const { isPending: deleteBusinessGroupLoading, mutate: deleteBusinessGroup } = useDeleteBusinessGroup({
    onSuccess: () => showNiceModalV2({ title: 'Data berhasil dihapus', type: 'success' }),
  });

  const { data: bucketBusinessGroup } = useGetBusinessGroup({
    bucketProcessId: processId,
    debtorId: debtorId,
    excludeSelectedGroup: true,
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  const businessGroupListContents = businessGroupListData?.contents;
  const businessGroupListPage = businessGroupListData?.page || {};

  const { data } = useGetBusinessGroup({
    bucketProcessId: processId,
    debtorId: debtorId,
    excludeSelectedGroup: true,
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  const groupBusinessDropdownList = data;

  const { isPending: saveBusinessGroupLoading, mutate: saveBusinessGroup } = useSaveBusinessGroup({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
      closeNiceModal(modal.GROUP_BUSINESS);
    },
  });

  const handleOpenAddModal = () => {
    NiceModal.show(modal.GROUP_BUSINESS, {
      dropdownDataList: groupBusinessDropdownList,
    });
  };

  const handleDeleteGroupBusiness = (data: any) => {
    const { id } = data;
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteBusinessGroup({
        id: id,
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin menghapus data ini?',
      type: 'warning',
    });
  };

  const isKadivTL = state.currentRole.includes(roles.KADIV) || state.currentRole.includes(roles.TL);
  const isViewOnly = viewOnly || (isKadivTL && viewOnly);

  const tableHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        width: '55px',
      },
      type: 'index',
    },
    {
      key: 'groupName',
      label: 'Nama Group Usaha',
      render: (row, index) => (
        <Input
          type="dropdown"
          placeholder="Select Tipe"
          containerSx={{ flex: 1 }}
          dropdownList={bucketBusinessGroup}
          value={businessGroupListContents[index].groupId.toString()}
          disabled
        />
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: (props) => [
        {
          iconName: 'delete',
          isDisabled: deleteBusinessGroupLoading || props.viewOnly || viewOnly,
          onClick: (data) => {
            handleDeleteGroupBusiness(data);
          },
        },
      ],
      sx: {
        width: '68px',
      },
      type: 'action',
    },
  ];

  return {
    bucketBusinessGroup,
    businessGroupListContents,
    businessGroupListLoading,
    businessGroupListPage,
    handleDeleteGroupBusiness,
    handleOpenAddModal,
    isViewOnly,
    itemPerPage,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};

export default useBusinessGroup;
