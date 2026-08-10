'use client';
import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { technicalStudyReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { reducer } from '@/components/layouts/AppLayout/App.constants';
import Button from '@/components/shared/Button';
import TextStyle from '@/components/shared/TextStyle';

import { FILTER_DIVISION_OPTIONS, FILTER_OPTIONS, SORT_OPTIONS } from '../mockData/mockData';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useRequest = () => {
  const [state, dispatch] = useApp();
  const { processId, setDebtorId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const router = useCustomRouter();

  const [filter, setFilter] = useState<SearchValue>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList(
    'filterStatusTechnicalReview',
  );
  const { data: searchByOptions } = useGetParameterList(
    'searchByTechnicalReviewList',
    { label: 'value1', value: 'value2' },
  );
  const { data: sortByOptions } = useGetParameterList(
    'orderByTechnicalReviewList',
    { label: 'value1', value: 'value2' },
  );
  const { data: divisionOptions } = useGetParameterList('division');
  // --- END OF PARAMETER ---

  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.TECHNICAL_REVIEW,
      process: `${TypeProcess.TECHNICAL_REVIEW}`,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  // Record activity when request list is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: TypeModule.TECHNICAL_REVIEW,
        process: TypeProcess.TECHNICAL_REVIEW,
        remarks: 'view technical study review request list',
      });
    }
  }, [data, recordActivity]);

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
      key: 'division',
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
      render: (row) => (
        <TextStyle variant="body4">
          {row.modifiedAt ? formatDateTime(row.modifiedAt) : '-'}
        </TextStyle>
      ),
      sx: { minWidth: '10vw' },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (row) => (
        <TextStyle variant="body4">
          {row.dueDate ? formatDateTime(row.dueDate) : '-'}
        </TextStyle>
      ),
      sx: { minWidth: '10vw' },
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'statusLabel',
      label: 'Progress Status',
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
            const processId = data.bucketProcessId;

            // Record activity for viewing request detail
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: processId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'technical-study-review',
              module: TypeModule.TECHNICAL_REVIEW,
              process: TypeProcess.TECHNICAL_REVIEW,
              remarks: `view technical study review request detail (processId: ${processId})`,
            });

            setDebtorId(data.debtorId);
            dispatch({
              data: { ...state.pages, technicalReviewProcess: data.process },
              type: reducer.SET_PAGES,
            });
            router.push(
              replacePath(technicalStudyReview.DEBTOR_INFORMATION_PAGE, {
                module: 'request',
                processId,
              }),
            );
          },
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions ?? SORT_OPTIONS;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? SORT_OPTIONS,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Period Created Date',
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
      options: divisionOptions ?? FILTER_DIVISION_OPTIONS,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions ?? FILTER_OPTIONS,
      type: 'multiple-autocomplete',
    }
  ];

  return {
    data,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useRequest;
