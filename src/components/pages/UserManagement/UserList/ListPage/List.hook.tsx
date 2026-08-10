import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { userManagement, accessid } from '@/configs/constants/pathname';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetMasterDivision from '@/hooks/services/useGetMasterDivision';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetAppsMenu from '@/components/pages/UserManagement/AccessMenu/hooks/useGetAccessMenuById';

import useDeleteUser from '../hooks/useDeleteUser';
import useGetUserList from '../hooks/useGetUserList';

import { modal, tableHeaderList } from './List.constants';

import type { ContentList } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useCustomRouter();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useState(null);

  const canViewUser = useCheckAccess(accessid.USER_LIST_VIEW);
  const canEditUser = useCheckAccess(accessid.USER_LIST_UPDATE);
  const canDeleteUser = useCheckAccess(accessid.USER_LIST_DELETE);

  const { data: searchByOptions } = useGetParameterList('searchByUser');
  const { data: sortByOptions } = useGetParameterList('sortByUser');
  const { data: divisionData } = useGetMasterDivision();

  const { data: menuList } = useGetAppsMenu();


  const divisionByOptions = divisionData?.map((item) => ({
    label: item.divisionName,
    value: item.code,
  }));

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: rowData.isEdit ? '#FFF5E4' : 'inherit',
  });


  const { data: userListData, isFetching: isLoading, refetch } = useGetUserList({
    filter: {
      ...filter?.filter,
      status: filter?.filter?.status ? filter?.filter?.status?.map((value) => Number(value)) : [],
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const { isPending: isDeleteLoading, mutate: deleteUser } = useDeleteUser({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
      refetch();
    },
  });

  const tableData = userListData?.contents.map((data) => ({
    ...data,
    division: data.divisionName ?? '-',
    email: data.email ?? '-',
    lastLoginDate: data.lastLogin ? formatDate(new Date(data.lastLogin)) : '-',
    modifiedApprovedDate: data.modifiedDate ? formatDate(new Date(data.modifiedDate)) : '-',
    modifiedBy: data.modifiedBy ?? '-',
    name: data.fullName ?? '-',
    status: data.status ?? '-',
    userId: data.userId ?? '-',
  }));

  const tablePage = userListData?.page;

  const handleApprovalModal = () => {
    NiceModal.show(modal.APPROVAL_MODAL);
  };

  const handleAddUser = () => {
    router.push(userManagement.USER_LIST.ADD);
  };

  const handleOpenDeleteModal = (data: any) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteUser({ id: data?.id }),
      submitText: 'Ya',
      title: `Apakah anda yakin untuk Menghapus data User ${data?.fullName}?`,
      type: 'warning',
    });
  };

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewUser ? [{
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(userManagement.USER_LIST.DETAIL, { id: data.id });
            router.push(nextPath);
          },
        }] : []),
        ...(canDeleteUser ? [{
          iconName: 'delete',
          onClick: (data) => {
            handleOpenDeleteModal(data);
          },
        }] : []),
      ],
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Modify Approved Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionByOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status User',
      options: [
        {
          label: 'Active',
          value: '0',
        },
        {
          label: 'Inactive',
          value: '1',
        }
      ],
      type: 'multiple-autocomplete',
    },
  ];

  return {
    anomalyRowStyle,
    filter,
    filterContentList,
    filterDropdownList,
    handleAddUser,
    handleApprovalModal,
    handleOpenDeleteModal,
    isDeleteLoading,
    isLoading,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};
