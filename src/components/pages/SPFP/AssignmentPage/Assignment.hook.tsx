'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { spfp } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeDivision } from '@/enums/Division';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, toDateString } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketListAssignment from '@/hooks/services/useGetBucketListAssignment';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useAssignment = () => {
  const [filter, setFilter] = useSessionStorage('filter-component-spfp-assignment', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [state, setState] = useState();
  const [permanent, setPermanent] = useState(false);
  const [selectedTask, setSelectedTask] = useState([]);
  const [{ userData }] = useApp();
  const userDivision = (userData?.user as any)?.accessManagementActive?.userDivision ||
    (userData?.user as any)?.userDivision ||
    (userData as any)?.userDivision;
  const division = userData?.user?.division;
  const isDpop = userDivision?.divisionCode?.includes('DPOP') ||
    division?.some((div) => div?.divisionCode?.includes('DPOP'));

  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('spfpStatusFilter');
  const { data: searchByOptions } = useGetParameterList(isDpop ? 'searchBySpfpDpop' : 'searchBySpfp', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortBySpfp', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('divisionOptionsSpdp', { label: 'value1', value: 'value2' });
  // --- END OF PARAMETER ---


  const { data, isLoading } = useGetBucketListAssignment({
    filter: {
      ...filter?.filter,
      module: TypeModule.SPFP,
      process: `${TypeProcess.SPDP}`,
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
    staffDivisionLabel: process.staffDivisionLabel ?? '-',
  }));

  const processPage = data?.page;

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleSelectTask = (data) => {

    if (selectedTask.length >= 5 && !selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId)) {
      NiceModal.show(MODAL.GLOBAL.WARNING, {
        title: 'Assignment  Maximum 5 Task',
      });
      return;
    }

    if (selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId)) {
      setSelectedTask(selectedTask.filter((item) => item.bucketProcessId !== data.bucketProcessId));
    } else {
      setSelectedTask([...selectedTask,
        {
          bucketProcessId: data.bucketProcessId,
          debtorName: data.debtorName,
          division: data.division,
          divisionId: data.divisionId,
          staffDivisionLabel: data.staffDivisionLabel,
          staffName: data.staffName,
        }]);
    }
  };

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId),
      key: 'checkbox',
      onSelectChange: handleSelectTask,
      sx: { width: '4%' },
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
      sx: { minWidth: '8vw' },
    },
    {
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '14vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: { minWidth: '14vw' },
    },
    {
      key: 'staffDivisionLabel',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
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
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'modifiedAt',
      label: 'Created Date',
      render: (row) => React.createElement(TextStyle, { variant: 'body4' }, row.modifiedAt !== null ? formatDate(row.modifiedAt, 'DD MMM YYYY, HH:mm:ss') : formatDate(row.createdAt, 'DD MMM YYYY, HH:mm:ss')),
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
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: row.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              module: TypeModule.SPFP,
              process: TypeProcess.SPDP,
              remarks: `view detail assignment task: ${row.bucketProcessId}`,
            });
            router.push(replacePath(
              spfp.DEBTOR_INFORMATION_PAGE,
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
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const handleClickAssign = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      module: TypeModule.SPFP,
      process: TypeProcess.SPDP,
      remarks: `open assign modal for ${selectedTask.length} task(s) in SPFP assignment page`,
    });
    NiceModal.show(MODAL.ASSIGN_TO, {
      isRiviewAssign: true,
      module: TypeModule.SPFP,
      process: TypeProcess.SPDP,
      selectedTask,
      setSelectedTask,
    });
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
    setState,
    state,
    tableHeader,
  };
};
