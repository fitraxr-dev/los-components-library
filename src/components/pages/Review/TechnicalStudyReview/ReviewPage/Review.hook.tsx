'use client';
import React, { useEffect, useState } from 'react';

import { technicalStudyReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { reducer } from '@/components/layouts/AppLayout/App.constants';
import Button from '@/components/shared/Button';
import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import { FILTER_DIVISION_OPTIONS, FILTER_OPTIONS, SORT_OPTIONS } from '../mockData/mockData';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useReview = () => {
  const [state, dispatch] = useApp();
  const { processId, setDebtorId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const router = useCustomRouter();

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList(
    'filterStatusTechnicalReviewDelst',
  );
  const { data: searchByOptions } = useGetParameterList(
    'searchByTechnicalReviewDelstList',
    { label: 'value1', value: 'value2' },
  );
  const { data: sortByOptions } = useGetParameterList(
    'orderByTechnicalReviewDelstList',
    { label: 'value1', value: 'value2' },
  );
  const { data: divisionOptions } = useGetParameterList('division');
  // --- END OF PARAMETER ---

  const defaultStatuses = ['REQUEST_SPECIALIST', 'RETURN_TO_SPECIALIST', 'RETURN_TO_SPECIALIST_FROM_KADIV_DELST'];

  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.TECHNICAL_REVIEW,
      process: TypeProcess.TECHNICAL_REVIEW_DELST,
      ...(filter?.filter?.status || filter?.searchDetail?.value ? {} : { status: defaultStatuses }),
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  // Record activity when review list is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: TypeModule.TECHNICAL_REVIEW,
        process: TypeProcess.TECHNICAL_REVIEW_DELST,
        remarks: 'view technical study review list',
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
      label: 'Master Id',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '7.5vw' },
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
      render: (row) => (
        <TextStyle variant="body4">{row.dueDate ? formatDateTime(row.dueDate) : '-'}</TextStyle>
      ),
      sx: { minWidth: '10vw' },
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'status',
      label: 'Progress Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          color="primary"
          noClick
        >
          {row.statusLabel}
        </Button>
      ),
      sx: { minWidth: '10vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            const processId = data.bucketProcessId;

            // Record activity for viewing review detail
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: processId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'technical-study-review',
              module: TypeModule.TECHNICAL_REVIEW,
              process: TypeProcess.TECHNICAL_REVIEW_DELST,
              remarks: `view technical study review detail (processId: ${processId})`,
            });

            setDebtorId(data.debtorId);
            dispatch({
              data: { ...state.pages, technicalReviewProcess: data.process },
              type: reducer.SET_PAGES,
            });
            router.push(replacePath(technicalStudyReview.DEBTOR_INFORMATION_PAGE, { module: 'review', processId }));
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
    },
    {
      endKey: 'endDate',
      label: 'Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      endKey: 'endDueDate',
      label: 'Due Date',
      startKey: 'startDueDate',
      type: 'period',
    },
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

export default useReview;
