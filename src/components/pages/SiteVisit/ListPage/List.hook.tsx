'use client';
import { useEffect, useState } from 'react';

import { siteVisit } from '@/configs/constants/pathname';
import { formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';


import TextStyle from '@/components/shared/TextStyle';

import useSiteVisitContext from '../shared/hooks/useSiteVisitContext';

import useGetSiteVisitLoc from './hooks/useGetSiteVisitListLoc';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const { updateState } = useSiteVisitContext();

  const [filter, setFilter] = useState<SearchValue>({
    filter: {},
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [state, setState] = useState();
  const router = useCustomRouter();


  // --- PARAMETER ---
  // Get Division filter options
  const { data: divisionOptions } = useGetParameterList('division');

  // Get Site Visit search by options
  const { data: searchByOptions } = useGetParameterList('searchBySiteVisit2', { label: 'value1', value: 'value2' });

  // Get Site Visit order by options
  const { data: orderByOptions } = useGetParameterList('orderBySiteVisit2', { label: 'value1', value: 'value2' });

  // Get Site Visit search by options
  const { data: statusOptions } = useGetParameterList('filterStatusSiteVisit');
  // --- END OF PARAMETER ---

  const { data, isFetching: isLoading } = useGetSiteVisitLoc({
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tablePage = data?.data?.page;
  const tableData = data?.data?.contents.map((item: any) => {
    const statusLabel = item?.statusLabel?.toUpperCase();
    const isStatusExcluded = statusLabel === 'CANCELED' || statusLabel === 'REJECTED' || statusLabel === 'COMPLETED';

    return {
      ...item,
      aging: isStatusExcluded ? '-' : (item?.aging !== null ? item.aging + ' Hari' : '-'),
      // dueDate: item?.dueDate ?? '-', // TODO: Check if '-' is correct for date type
      visitLocation: item?.visitLocation ?? '-',
    };
  });

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '1vw' },
      type: 'index',
    },
    {
      key: 'bucketMasterId',
      label: 'Master ID',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'institutionType',
      label: 'Tipe Institusi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'staffDivisionLabel',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'visitLocation',
      label: 'Lokasi Site Visit',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'modifiedAt',
      label: 'Created Date',
      render: (data) => (
        <TextStyle variant="body5">
          {data?.modifiedAt ? formatDateTime(data?.modifiedAt) : '-'}
        </TextStyle>),
      sx: { minWidth: '13vw' },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sx: { minWidth: '11vw' },
      type: 'date',

    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '6vw' },
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
          iconName: 'detail', onClick: (row) => {
            updateState({ siteVisitBucketDetail: row });
            router.push(replacePath(
              siteVisit.DEBTOR_INFORMATION_PAGE,
              {
                processId: row?.bucketProcessId,
              },
            ));
          },
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: orderByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Created Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      allowFutureDates: true,
      endKey: 'dueDate',
      label: 'Due Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startDueDate',
      type: 'period',
    },
    {
      endKey: 'aging',
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
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    setState,
    state,
    tableData,
    tableHeader,
    tablePage,
  };
};
