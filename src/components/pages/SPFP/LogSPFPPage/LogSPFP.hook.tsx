'use client';
import React, { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { spfp } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import TextStyle from '@/components/shared/TextStyle';

import { TABLE_HEADER } from './LogSPFP.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useLogSPFP = () => {
  const pathname = usePathname();
  const bucket = useSpfpBucketContext();
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();

  const [filter, setFilter] = useSessionStorage('filter-component-log-spfp', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { viewOnly } = useViewOnly();

  const [{ currentRole, currentPosition, userData }] = useApp();
  const userDivision = (userData?.user as any)?.accessManagementActive?.userDivision ||
    (userData?.user as any)?.userDivision ||
    (userData as any)?.userDivision;
  const division = userData?.user?.division;
  const isDpop = userDivision?.divisionCode?.includes('DPOP') ||
    division?.some((div) => div?.divisionCode?.includes('DPOP'));

  const { data: spfpStatusOptions } = useGetParameterList('spfpStatusFilter');
  const { data: divisionOptions } = useGetParameterList('division');
  const { data: searchByOptions } = useGetParameterList('searchByLogSpfp', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByLogSpfp', { label: 'value1', value: 'value2' });

  // Get bucket detail to retrieve bucketMaster
  const { data: bucketDetail } = useGetBucketById({
    ...bucket,
  });

  const bucketMaster = bucketDetail?.bucketMaster;

  // Get Log SPFP list with COMPLETED_HISTORY status
  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      bucketMaster: bucketMaster,
      module: TypeModule.SPFP,
      process: TypeProcess.SPFP_FINAL,
      status: ['COMPLETED_HISTORY'],
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  }, {
    enabled: !!bucketMaster,
  });

  const listContents = data?.contents;
  const listPage = data?.page;

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  // Table header
  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER.slice(0, 7), // No, Master ID, ID, Institution Type, Nama Customer, Divisi, Nama Staff
    {
      key: 'createdAt',
      label: 'Created Date',
      render: (row) => React.createElement(TextStyle, { variant: 'body4' },
        row.createdAt ? formatDate(row.createdAt, 'DD MMM YYYY, HH:mm:ss') : '-'),
      sx: { minWidth: '13vw' },
      type: 'date',
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (row) => React.createElement(TextStyle, { variant: 'body4' },
        row.dueDate ? formatDate(row.dueDate, 'DD MMM YYYY, HH:mm:ss') : '-'),
      sx: { minWidth: '13vw' },
    },
    ...TABLE_HEADER.slice(7), // Aging, Status
    !viewOnly && {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: data.bucketProcessId,
              changeAfter: '',
              changeBefore: '',
              module: TypeModule.SPFP,
              process: TypeProcess.SPFP_FINAL,
              remarks: `view detail SPFP bucket: ${data.bucketProcessId} (debtor: ${data.debtorName || 'N/A'})`,
            });
            window.open(
              replacePath(
                spfp.DEBTOR_INFORMATION_PAGE,
                {
                  module: 'bucket',
                  processId: data.bucketProcessId,
                },
              ) + `?fromPage=logSpfp&fromPageUrl=${encodeURIComponent(pathname)}`,
              '_blank',
            );
          },
        },
      ],
      sx: { minWidth: '9vw' },
      type: 'action',
    },
  ].filter(Boolean) as TableHeader[];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    listContents,
    listPage,
    page,
    pageSize,
    pathname,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};
