'use client';

import React, { useEffect, useState } from 'react';

import { businessActivityReport } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetBucketCollaboration from '@/hooks/services/useGetUserCollaboration';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import TextStyle from '@/components/shared/TextStyle';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useList = () => {
  const router = useCustomRouter();
  const [{ currentRole }] = useApp();
  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { recordActivity } = useRecordLog();

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusBar');
  const { data: searchByOptions } = useGetParameterList('searchByBar', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByBar', { label: 'value1', value: 'value2' });


  const { data, isFetching: isLoading } = useGetBucketCollaboration({
    filter: {
      ...filter?.filter,
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '1vw' },
      type: 'index',
    },
    {
      key: 'bucketProcessId',
      label: 'Bar ID',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '10vw' },
    },
    {
      key: '',
      label: 'Call Date',
      render: (row) => (
        <TextStyle variant="body4">
          {row.additionalData?.callDate ? formatDateTime(row.additionalData.callDate) : '-'}
        </TextStyle>
      ),
      sx: { minWidth: '10vw' },
    },
    {
      key: 'modifiedAt',
      label: 'Created Date',
      render: (row) => React.createElement(TextStyle, { variant: 'body4' }, row.modifiedAt !== null ? formatDate(row.modifiedAt, 'DD MMM YYYY, HH:mm:ss') : formatDate(row.createdAt, 'DD MMM YYYY, HH:mm:ss')),
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: { minWidth: '10vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            router.push(
              replacePath(businessActivityReport.INFORMATION, {
                processId: data.bucketProcessId,
              }),
            );
          },
        },
      ],
      sx: { minWidth: '6vw' },
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
      endKey: 'callEndDate',
      key: 'callDate',
      label: 'Periode Call Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'callStartDate',
      type: 'period',
    },
    {
      endKey: 'endDate',
      key: 'createdDate',
      label: 'Periode Created Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'business-activity-report',
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
      remarks: 'view list business activity report',
    });
  }, []);

  return {
    currentRole,
    data,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useList;
