'use client';
import React, { useEffect, useState } from 'react';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
} from '@/configs/constants';
import { accessid, creditChecking } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, toDateString } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';

import { reducer } from '@/components/layouts/AppLayout/App.constants';
import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import TextStyle from '@/components/shared/TextStyle';

import { FILTER_OPTIONS, SORT_OPTIONS } from '../__mock_data__';


import type { TableHeader } from '@/components/shared/Table/Table.types';


const useRequest = () => {
  const [state, dispatch] = useApp();
  const { filterStatusCreditChecking } = useCreditCheckingContext();
  const { processId, setDebtorId } = useIdentity();
  const router = useCustomRouter();
  const [filter, setFilter] = useSessionStorage('filter-component-cc-request', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { divisionCode } = useDivision();
  const isTaskForce = state.currentPosition.includes('TASK_FORCE');

  const canViewCreditChecking = useCheckAccess(accessid.REQUEST_CREDIT_CHECKING_VIEW);
  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION];
  const isBusiness = businessDivisionArray?.includes(divisionCode);

  const { data: statusOptions } = useGetParameterList(filterStatusCreditChecking, {
    label: 'value1',
    value: 'value2',
  });
  const { data: searchByOptions } = useGetParameterList('searchByRequestCreditChecking', {
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
      process: TypeProcess.CREDIT_CHECKING,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const bucketListContents = data?.contents.map(((item) => ({
    ...item,
    aging: item.aging ?? '-',
    status: item.statusLabel ?? '-',
  })));

  const { data: filterByDivisionOptions } = useGetParameterList('filterDivisionCreditChecking', {
    label: 'value1',
    value: 'value2',
  });

  const bucketListPage = data?.page;

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '1vw' },
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
      sx: { minWidth: '10vw' },
    },
    {
      key: 'status',
      label: 'Status',
      sx: { minWidth: '18vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewCreditChecking ? [{
          iconName: 'detail', onClick: (data) => {
            const processId = data.bucketProcessId;
            setDebtorId(data.debtorId);
            dispatch({
              data: { ...state.pages, creditCheckingProcess: data.process },
              type: reducer.SET_PAGES,
            });
            router.push(replacePath(creditChecking.REQUEST_DEBTOR_INFORMATION_PAGE, { processId }));
          },
        }] : []),
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions ?? [];

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
      key: 'division',
      label: 'Divisi',
      options: filterByDivisionOptions ?? [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions ?? FILTER_OPTIONS,
      // type: statusOptions.length > 10 ? 'multiple-autocomplete' : 'multiple-select',
      type: 'multiple-autocomplete',

    },
  ];

  return {
    bucketListContents,
    bucketListPage,
    filter,
    filterContentList,
    filterDropdownList,
    isBusiness,
    isLoading,
    isTaskForce,
    page,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useRequest;
