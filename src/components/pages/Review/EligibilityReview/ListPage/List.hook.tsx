import React, { useState } from 'react';

import { usePathname } from 'next/navigation';

import { accessid, eligibilityReview } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, toDateString } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';
import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import { TABLE_HEADER } from './List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useListPage = () => {
  const [isPermanentDate, setIsPermanentDate] = useState(false);
  const [filter, setFilter] = useSessionStorage('filter-component-eligibilityreview', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useCustomRouter();
  const path = usePathname();
  const pathModule = getLastPath(path);
  const canViewEligibility = useCheckAccess(accessid.LIST_ELIGIBILITY_REVIEW_VIEW);
  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusMIPReviewDEPIList');
  const { data: searchByOptions } = useGetParameterList('searchByMIPReviewDEPIList', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByMIPReviewDEPIList', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });

  // --- END OF PARAMETER ---

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
      startKey: 'startDueDate',
      type: 'period',
    },
    {
      endKey: 'endAging',
      label: 'Aging',
      startKey: 'startAging',
      type: 'textPeriod',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
  ];

  // Get list review rating & kelayakan
  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const processList = data?.contents?.map((process) => ({
    ...process,
    aging: process.aging ?? '-',
  }));

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'bucketMaster',
      label: 'Master ID',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'institutionTypeLabel',
      label: 'Tipe Institusi',
      sx: { minWidth: '7.5vw' },
    },
    ...TABLE_HEADER,
    {
      key: 'pic',
      label: 'PIC',
      render: (row) => <PICRenderer data={row?.pic} />,
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
      key: 'dueDate',
      label: 'Due Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: {
        minWidth: '15vw',
      },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewEligibility ? [{
          iconName: 'detail', onClick: (data) => {
            router.push(
              replacePath(
                eligibilityReview.DEBTOR_INFORMATION_PAGE,
                {
                  module: pathModule,
                  processId: data.bucketProcessId,
                },
              ),
            );
          },
        }] : []),
      ],
      sx: { minWidth: '7.5vw' },
      type: 'action',
    },
  ];

  const processListPage = data?.page;

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    isPermanentDate,
    page,
    pageSize,
    processList,
    processListPage,
    setFilter,
    setIsPermanentDate,
    setPage,
    setPageSize,
    tableHeader,
  };
};
