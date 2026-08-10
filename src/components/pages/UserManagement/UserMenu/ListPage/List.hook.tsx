import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { userManagement } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetUserList from '../shared/hooks/user-controller/useGetUserList';

import { TABLE_HEADER, modal } from './List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const filterDropdownList = [
  {
    'label': 'User ID',
    'value': 'USER_ID',
  },
  {
    'label': 'Nama',
    'value': 'NAME',
  },
  {
    'label': 'Email',
    'value': 'EMAIL',
  },
  {
    'label': 'User Status',
    'value': 'USER_STATUS',
  },
  {
    'label': 'Last Login Date',
    'value': 'LAST_LOGIN_DATE',
  },

];

const filterContentList = [
  {
    key: 'sortList',
    label: 'Urutkan Berdasarkan',
    options: {},
    type: 'sort',
  },
  {
    endKey: 'endDate',
    label: 'Periode Created Date',
    startKey: 'startDate',
    type: 'period',
  },
  {
    key: 'status',
    label: 'Status',
    options: {},
    type: 'multiple-autocomplete',
  },
];

export const useList = () => {
  const router = useCustomRouter();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-component-maintenance-user', null);

  const { data: userListData, isFetching: isLoading } = useGetUserList({
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const handleApprovalModal = () => {
    NiceModal.show(modal.APPROVAL_MODAL);
  };

  const filterDropdownList = [
    {
      label: 'Nama',
      value: 'fullName',
    }
  ];

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(userManagement.USER_DETAIL, { processId: data.userId });
            router.push(nextPath);
          },
        },
      ],
      type: 'action',
    },
  ];


  return {
    filter,
    filterDropdownList,
    handleApprovalModal,
    isLoading,
    itemPerPage,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
    userListData,
  };
};
