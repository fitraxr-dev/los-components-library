'use client';
import React, { useEffect, useState } from 'react';

import { accessid, creditChecking } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { FILTER_OPTIONS, SORT_OPTIONS } from '../__mock_data__';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useBucketList = () => {
  const { filterStatusCreditChecking } = useCreditCheckingContext();
  const [filter, setFilter] = useSessionStorage('filter-bucket-credit-checking-list', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [state, setState] = useState();
  const canViewCreditChecking = useCheckAccess(accessid.BUCKET_CREDIT_CHECKING_VIEW);
  const router = useCustomRouter();

  const { data: statusOptions } = useGetParameterList(filterStatusCreditChecking, {
    label: 'value1',
    value: 'value2',
  });

  const { data: searchByOptions } = useGetParameterList('searchByBucketCreditChecking', {
    label: 'value1',
    value: 'value2',
  });

  const { data: sortByOptions } = useGetParameterList('sortByBucketCreditChecking', {
    label: 'value1',
    value: 'value2',
  });

  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.CREDIT_CHECKING,
      process: TypeProcess.CREDIT_CHECKING_DPOP,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableData = data?.contents.map(((item) => ({
    ...item,
    aging: item.aging ?? '-',
    bucketProcessId: item.bucketProcessId ?? '-',
    debtorName: item.debtorName ?? '-',
    division: item.division ?? '-',
    rmName: item.staffName ?? '-',
    status: item.statusLabel ?? '-',
  })));

  const tablePage = data?.page;

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4vw' },
      type: 'index',
    },
    {
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'rmName',
      label: 'Nama Staff',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'staffDivisionLabel',
      label: 'Divisi',
      sx: { minWidth: '13vw' },
    },
    {
      key: 'pic',
      label: 'PIC',
      render: (row) => (
        <ColumnWrapper>
          {row?.pic?.map((item, idx: number) => {
            return (
              <TextStyle key={idx} weight={item.isLeader ? 600 : 400}>
                {item.name}
              </TextStyle>
            );
          })}
        </ColumnWrapper>
      ),
      sx: { minWidth: '8vw' },
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
      sx: { minWidth: '8vw' },
      type: 'date',
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'status',
      label: 'Progress Status',
      sx: { minWidth: '25vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewCreditChecking ? [{
          iconName: 'detail', onClick: (data) => {
            router.push(replacePath(
              creditChecking.BUCKET_DEBTOR_INFORMATION_PAGE,
              {
                processId: data.bucketProcessId,
              },
            ));
          },
        }] : []),
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
      options: sortByOptions ?? SORT_OPTIONS,
      type: 'sort',
    },
    {
      allowFutureDates: true,
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
      options: statusOptions ?? FILTER_OPTIONS,
      type: statusOptions.length > 10 ? 'multiple-autocomplete' : 'multiple-select',
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

export default useBucketList;
