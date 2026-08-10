'use client';
import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { userManagement } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetAccessList from '@/components/pages/UserManagement/AccessMenu/hooks/useGetAccessList';

import SLAPipelineModal from '../components/SLAPipelineModal/SLAPipelineModal';
import { modal } from '../constants';

import { TABLE_HEADER } from './Detail.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [pageSize, setPageSize] = useState(5);

  // --- PARAMETER ---
  // Get MIP status filter options
  const { data: statusOptions } = useGetParameterList ('slaStatusFilter');


  // Get MIP sort by options
  const { data: sortByOptions } = useGetParameterList('sortBySla');

  const { data, isLoading } = useGetAccessList({
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: { key: 'roleRefactorCode', value: '' },
  });

  useMemo(() => {
    setPage(1);
  }, [filter]);

  // const handleApprovalModal = () => {
  //   NiceModal.show(modal.APPROVAL_MODAL);
  // };

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          onClick: (data) => {
            NiceModal.show(modal.SLA_PIPELINE_MODAL);
          },
        },
        {
          iconName: 'delete',
          onClick: (data) => {
          },
        },
        {
          iconName: 'detail',
          onClick: (data) => {
            NiceModal.show(modal.DETAIL_MODAL, { data: createDetailObject(data), title: 'Detail Master SLA Pipeline' });
          },
        },
      ],
      type: 'action',
    },
  ];

  const createDetailObject = (data) => {
    return [
      {
        label: 'Role',
        value: data.role,
      },
      {
        label: 'Active',
        value: data.isActive,
      },
      {
        label: 'SLA Deadline',
        value: data.deadline,
      },
    ];
  };

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
    // {
    //   key: 'sortList',
    //   label: 'Urutkan Berdasarkan',
    //   options: sortByOptions,
    //   type: 'sort',
    // },
    // {
    //   endKey: 'endDate',
    //   label: 'Periode Created Date',
    //   startKey: 'startDate',
    //   type: 'period',
    // },
    // {
    //   key: 'status',
    //   label: 'Status',
    //   options: mipStatusOptions,
    //   type: 'multiple-select',
    // },
  ];

  return {
    data,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    pathname,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};
