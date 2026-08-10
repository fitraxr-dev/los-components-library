'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { accessid, ESDD } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { TypePosition } from '@/enums/Position';
import { formatDate, toDateString } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketListAssignment from '@/hooks/services/useGetBucketListAssignment';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';


import Button from '@/components/shared/Button';
import TextStyle from '@/components/shared/TextStyle';

import { useESDDAccess } from '../hooks/useESDDAccess';


import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useAssignment = () => {
  const [filter, setFilter] = useSessionStorage('filter-component-delst-assignment', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [state, setState] = useState();
  const [permanent, setPermanent] = useState(false);
  const [selectedTask, setSelectedTask] = useState([]);
  const router = useCustomRouter();
  const path = usePathname();
  const pathModule = getLastPath(path);
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const canViewEsdd = useCheckAccess(accessid.ESDD_ASSIGNMENT_VIEW);
  const { assignment } = useESDDAccess();
  const {
    canCreate: canCreateESDDAssignment,
    canUpdate: canUpdateESDDAssignment,
  } = assignment;

  useEffect(() => {
    if (processId) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: String(processId || ''),
        changeAfter: JSON.stringify({ processId }),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'view assignment ESDD page',
      });
    }
  }, [processId, recordActivity]);


  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusMIPReviewESDDList');
  const { data: searchByOptions } = useGetParameterList('searchByMIPReviewESDDList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByMIPReviewESDDList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: divisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });

  // --- END OF PARAMETER ---


  const { data, isLoading } = useGetBucketListAssignment({
    filter: {
      ...filter?.filter,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
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
    ...(canUpdateESDDAssignment ? [{
      isDisabled: () => false,
      isSelected: (data) => selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId),
      key: 'checkbox',
      onSelectChange: handleSelectTask,
      sx: { width: '4%' },
      type: 'checkbox' as const,
    }] : []),
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
      sx: { minWidth: '7vw' },
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
        ...(canViewEsdd ? [{
          iconName: 'detail', onClick: (row) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: row.bucketProcessId,
              changeAfter: JSON.stringify({ bucketProcessId: row.bucketProcessId, debtorName: row.debtorName }),
              module: TypeModule.MIP_REVIEW,
              process: TypeProcess.REVIEWER_DELST,
              remarks: 'view assignment ESDD detail',
            });

            router.push(replacePath(
              ESDD.DEBTOR_INFORMATION_PAGE,
              {
                module: pathModule,
                processId: row.bucketProcessId,
              },
            ));
          },
        }] : []),
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

  const handleClickAssign = () => {
    if (!canUpdateESDDAssignment) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: selectedTask.map((task) => task.bucketProcessId).join(', '),
      changeBefore: JSON.stringify({
        selectedTasks: selectedTask.map((task) => task.bucketProcessId),
        taskCount: selectedTask.length,
      }),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: `Opening assign modal for ${selectedTask.length} selected task(s)`,
    });

    NiceModal.show(MODAL.ASSIGN_TO, {
      isRiviewAssign: true,
      module: TypeModule.MIP_REVIEW,
      position: TypePosition.STAFF_ESDD,
      process: TypeProcess.REVIEWER_DELST,
      selectedTask,
      setSelectedTask,
    });
  };

  return {
    canCreateESDDAssignment,
    canUpdateESDDAssignment,
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
