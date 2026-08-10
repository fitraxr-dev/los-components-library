'use client';
import React, { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { spfp } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';


import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import { TABLE_HEADER } from './List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const { recordActivity } = useRecordLog();

  const [filter, setFilter] = useSessionStorage('filter-component-spfp', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const path = usePathname();
  const pathModule = getLastPath(path);
  const [{ currentRole, currentPosition, userData }] = useApp();
  const userDivision = (userData?.user as any)?.accessManagementActive?.userDivision ||
    (userData?.user as any)?.userDivision ||
    (userData as any)?.userDivision;
  const division = userData?.user?.division;
  const divisionForRole = userDivision || division;
  const isDpop = userDivision?.divisionCode?.includes('DPOP') ||
    division?.some((div) => div?.divisionCode?.includes('DPOP'));
  const isMaker = currentRole?.includes(roles.MAKER);
  const isChecker = currentRole?.includes(roles.CHECKER);
  const isTaskForce = currentPosition?.includes('TASK_FORCE');
  const isDti = isMaker || isChecker || isTaskForce;
  // --- PARAMETER ---
  // Get status filter options
  const { data: spfpStatusOptions } = useGetParameterList('spfpStatusFilter');
  const { data: divisionOptions } = useGetParameterList('division');

  // Get search by options
  const { data: searchByOptions } = useGetParameterList(isDpop ? 'searchBySpfpDpop' : 'searchBySpfp', { label: 'value1', value: 'value2' });

  // Get sort by options
  const { data: sortByOptions } = useGetParameterList('sortBySpfp', { label: 'value1', value: 'value2' });
  // --- END OF PARAMETER ---
  let process = '';
  if (isDpop || isDti) {
    process = `${TypeProcess.SPDP}|${TypeProcess.SPFP}|${TypeProcess.SPFP_FINAL}`;
  } else {
    process = `${TypeProcess.SPFP}|${TypeProcess.SPFP_FINAL}`;
  }
  // Get SPFP list
  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.SPFP,
      process: process,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const listContents = data?.contents;
  const listPage = data?.page;

  useEffect(() => {
    setPage(1);
  }, [filter]);


  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    ...(isDpop ? [{
      key: 'pic',
      label: 'PIC',
      render: (row) => <PICRenderer data={row?.pic} />,
      sx: { minWidth: '10vw' },
    }] : []),
    {
      key: 'modifiedAt',
      label: 'Created Date',
      render: (row) => React.createElement(TextStyle, { variant: 'body4' },
        row.modifiedAt !== null ? formatDate(row.modifiedAt, 'DD MMM YYYY, HH:mm:ss') : formatDate(row.createdAt, 'DD MMM YYYY, HH:mm:ss')),
      sx: { minWidth: '13vw' },
      type: 'date',
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (row) =>
        React.createElement(
          TextStyle,
          { variant: 'body4' },
          row.dueDate
            ? formatDate(row.dueDate, 'DD MMM YYYY, HH:mm:ss')
            : '-'
        ),
      sx: { minWidth: '13vw' },
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '9vw' },
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: { minWidth: '13vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            // Record activity for view detail
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: data.bucketProcessId,
              changeAfter: '',
              changeBefore: '',
              module: TypeModule.SPFP,
              process: process,
              remarks: `view detail SPFP bucket: ${data.bucketProcessId} (debtor: ${data.debtorName || 'N/A'})`,
            });
            router.push(
              replacePath(
                spfp.DEBTOR_INFORMATION_PAGE,
                {
                  module: pathModule,
                  processId: data.bucketProcessId,
                },
              ),
            );
          },
        },
      ],
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
      endKey: 'endDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      allowFutureDates: true,
      endKey: 'endDueDate',
      label: 'Due Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startDueDate',
      type: 'period',
    },
    {
      endKey: 'endAging',
      label: 'Aging',
      placeholder1: 'Start Aging',
      placeholder2: 'End Aging',
      startKey: 'startAging',
      type: 'textPeriod',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: spfpStatusOptions,
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
