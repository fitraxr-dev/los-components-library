'use client';
import { useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { userManagement } from '@/configs/constants/pathname';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetAccessList from '../hooks/useGetAccessList';

import { tableHeaderList, modal } from './List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useCustomRouter();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState(null);
  const [pageSize, setPageSize] = useState(10);

  const { data: searchByOptions } = useGetParameterList('searchByAccessMenu');
  const { data: sortByOptions } = useGetParameterList('sortByAccessMenu');

  const { data: accessData, isLoading } = useGetAccessList({
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail,
    sortList: filter?.sortList ?? {},
  });

  const tableData = useMemo(() => {
    return accessData?.contents?.map((item) => ({
      ...item,
      accessMenuName: item.menuAccessName || '-',
      createdDate: item.createdDate ? formatDate(new Date(item.createdDate)) : '-',
      lastMaintainDate: item.lastUpdatedDate ? formatDate(new Date(item.lastUpdatedDate)) : '-',
    }));

  }, [accessData]);

  const tablePage = accessData?.page;

  const handleApprovalModal = () => {
    NiceModal.show(modal.APPROVAL_MODAL);
  };

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: rowData.isEdit ? '#FFF5E4' : 'inherit',
  });

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            router.push(
              replacePath(
                userManagement.ACCESS_MENU.DETAIL,
                {
                  id: data?.menuAccessCode,
                },
              ),
            );
          },
        },
      ],
      sx: {
        minWidth: '4vw',
      },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endLastUpdatedDate',
      label: 'Last Maintain Date',
      startKey: 'startLastUpdatedDate',
      type: 'period',
    },
    {
      endKey: 'endDate',
      label: 'Created Date',
      startKey: 'startDate',
      type: 'period',
    },
  ];

  return {
    anomalyRowStyle,
    filter,
    filterContentList,
    filterDropdownList,
    handleApprovalModal,
    isLoading,
    page,
    router,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    tablePage,
  };
};
