'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { technicalStudyReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketListAssignment from '@/hooks/services/useGetBucketListAssignment';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';
import TextStyle from '@/components/shared/TextStyle';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useAssignment = () => {
  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [permanent, setPermanent] = useState(false);
  const [selectedTask, setSelectedTask] = useState([]);

  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusAssignmentTechnicalReview');
  const { data: searchByOptions } = useGetParameterList('searchByAssignmentTechnicalReview', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('orderByAssignmentTechnicalReview', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('division');
  // --- END OF PARAMETER ---

  const defaultStatuses = ['STAFF_ASSIGNMENT'];

  const { data, isLoading } = useGetBucketListAssignment({
    filter: {
      ...filter?.filter,
      module: TypeModule.TECHNICAL_REVIEW,
      process: TypeProcess.TECHNICAL_REVIEW_DELST,
      ...(filter?.filter?.status ? {} : { status: defaultStatuses }),

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
    division: process.division ?? '-',
  }));

  const processPage = data?.page;

  // Record activity when assignment list is loaded
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
        remarks: 'view technical study review assignment list',
      });
    }
  }, [data, recordActivity]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId)) {
          setSelectedTask(selectedTask.filter((item) => item.bucketProcessId !== data.bucketProcessId));
        } else {
          setSelectedTask([...selectedTask, {
            bucketProcessId: data.bucketProcessId, debtorName: data.debtorName,
            division: data.division, divisionId: data.divisionId, staffDivision: data.staffDivision,
            staffDivisionLabel: data.staffDivisionLabel, staffName: data.staffName,
          }]);
        }
      },
      sx: { textAlign: 'center', width: '4%' },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4vw' },
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
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '14vw' },
    },
    {
      key: 'staffDivisionLabel',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: { minWidth: '14vw' },
    },
    {
      key: 'pic',
      label: 'PIC',
      render: (row) => {
        if (!row.pic || !Array.isArray(row.pic)) return <TextStyle variant="body4">-</TextStyle>;
        const leaderPic = row.pic.find((pic) => pic.isLeader);
        const picName = leaderPic ? leaderPic.name : (row.pic[0]?.name || '-');
        return <TextStyle variant="body4">{picName}</TextStyle>;
      },
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
      render: (row) => (
        <TextStyle variant="body4">{row.dueDate ? formatDateTime(row.dueDate) : '-'}</TextStyle>
      ),
      sx: { minWidth: '10vw' },
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '7vw' },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          color="primary"
          noClick
        >
          {row.statusLabel ?? '-'}
        </Button>
      ),
      sx: { minWidth: '12vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (row) => {
            // Record activity for viewing assignment detail
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: row.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'technical-study-review',
              module: TypeModule.TECHNICAL_REVIEW,
              process: TypeProcess.TECHNICAL_REVIEW_DELST,
              remarks: `view technical study review assignment detail (processId: ${row.bucketProcessId})`,
            });

            router.push(replacePath(
              technicalStudyReview.DEBTOR_INFORMATION_PAGE,
              {
                module: 'assignment',
                processId: row.bucketProcessId,
              },
            ));
          },
        },
      ],
      sx: { minWidth: '5vw' },
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
    {
      endKey: 'endDate',
      label: 'Created Date',
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
  ];

  const handleClickAssign = () => {
    NiceModal.show(
      MODAL.ASSIGN_TO,
      {
        module: TypeModule.TECHNICAL_REVIEW,
        process: TypeProcess.TECHNICAL_REVIEW_DELST,
        selectedTask,
        setSelectedTask,
      }
    );
  };

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleClickAssign,
    isLoading,
    page,
    pageSize,
    permanent,
    processList,
    processPage,
    selectedTask,
    setFilter,
    setPage,
    setPageSize,
    setPermanent,
    tableHeader,
  };
};
