'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, ESDD } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { TypePosition } from '@/enums/Position';
import { formatDate, toDateString } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';


import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { useESDDAccess } from '../hooks/useESDDAccess';


import { TABLE_HEADER_MONITORING } from './Monitoring.constants';

import type { Task } from './Monitoring.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useMonitoring = () => {
  const router = useCustomRouter();
  const [filter, setFilter] = useSessionStorage('filter-component-delst-monitoring', null);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [selectedTask, setSelectedTask] = useState<Array<Task>>([]);
  const [divisionId, setDivisionId] = useState('');
  const path = usePathname();
  const pathModule = getLastPath(path);
  const { recordActivity } = useRecordLog();
  const [{ currentRole }] = useApp();
  const isChecker = currentRole?.includes(roles.CHECKER);
  const canViewEsdd = useCheckAccess(accessid.ESDD_MONITORING_VIEW);
  const { monitoring } = useESDDAccess();
  const {
    canCreate: canCreateESDDMonitoring,
    canUpdate: canUpdateESDDMonitoring,
  } = monitoring;

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

  const { data: monitoringData, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const monitoringList = monitoringData?.contents.map((content) => ({
    ...content,
    aging: content.aging ?? '-',
    bucketMaster: content.bucketMaster ?? '-',
    createdAt: formatDate(new Date(content.createdAt), 'DD MMMM YYYY'),
    debtorName: content.debtorName ?? '-',
    divisionId: content.divisionId ?? '-',
    // dueDate: content.dueDate ?? '-', // TODO: Check if '-' is correct for date type
    id: content.bucketProcessId,
    institutionTypeLabel: content.institutionTypeLabel ?? '-',
    pic: content.pic.map((item) => ({
      ...item,
      reAssignTo: {
        directorate: null,
        division: null,
        endDate: null,
        id: null,
        isPermanent: false,
        jobPosition: null,
        name: null,
        picId: null,
        startDate: null,
      },
      taskId: content.bucketProcessId,
    })),
    staffDivisionLabel: content.staffDivisionLabel ?? '-',
    staffName: content.staffName ?? '-',
    status: content.statusLabel ?? '-',
  }));

  useEffect(() => {
    if (monitoringData?.contents && monitoringData.contents.length > 0) {
      const bucketIds = monitoringData.contents.map((item) => item.bucketProcessId).join(', ');

      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: bucketIds,
        changeAfter: JSON.stringify({
          bucketIds: monitoringData.contents.map((item) => item.bucketProcessId),
          pageType: 'monitoring_list',
          totalMonitoring: monitoringData.contents.length,
        }),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'view monitoring ESDD page',
      });
    }
  }, [monitoringData, recordActivity]);

  if (monitoringList) {
    monitoringList.forEach((item) => {
      const { pic } = item;
      let leaderIndex = pic.findIndex((picObj) => picObj.isLeader === true);
      if (leaderIndex !== -1) {
        let leaderObj = item.pic.splice(leaderIndex, 1)[0];
        pic.unshift(leaderObj);
      }
    });
  }

  const monitoringPage = monitoringData?.page;

  const tableHeaderMonitoring: TableHeader[] = [
    ...(isChecker ? [] : [{
      isDisabled: () => false,
      isSelected: (data) => selectedTask.some((item) => item.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {

        if (selectedTask.length >= 5 && !selectedTask.some((item) => item.id === data.id)) {
          NiceModal.show(MODAL.GLOBAL.WARNING, {
            title: 'Assignment  Maximum 5 Task',
          });
          return;
        }
        setDivisionId(data.divisionId);
        if (selectedTask.some((item) => item.id === data.id)) {
          setSelectedTask(selectedTask.filter((item) => item.id !== data.id));
        } else {
          setSelectedTask([
            ...selectedTask, data]
            .sort(
              (a: Task, b: Task) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
            ));
        }
      },
      sx: { minWidth: '3.6vw' },
      type: 'checkbox' as const,
    }]),
    ...TABLE_HEADER_MONITORING,
    {
      key: 'pic',
      label: 'PIC',
      render: (row) => (
        <ColumnWrapper>
          {row?.pic?.length > 0 ? (
            row.pic.map((item, idx: number) => (
              <TextStyle key={idx} weight={item.isLeader ? 600 : 400}>
                {item.name ?? '-'}
              </TextStyle>
            ))
          ) : (
            <TextStyle>-</TextStyle>
          )}
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
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sx: {
        minWidth: '9vw',
      },
      type: 'date',
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: {
        minWidth: '8vw',
      },
    },
    {
      key: 'status',
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
          iconName: 'detail', onClick: (data) => {

            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: String(data.id),
              changeAfter: JSON.stringify({ bucketProcessId: data.id, debtorName: data.debtorName }),
              module: TypeModule.MIP_REVIEW,
              process: TypeProcess.REVIEWER_DELST,
              remarks: 'view monitoring ESDD detail',
            });

            router.push(replacePath(
              ESDD.DEBTOR_INFORMATION_PAGE,
              {
                module: pathModule,
                processId: data.id,
              },
            ));
          },
        }] : []),
      ],
      sx: {
        minWidth: '6vw',
      },
      type: 'action' as const,
    },
  ];

  const handleClickReassignTo = () => {
    if (!canUpdateESDDMonitoring) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: selectedTask.map((task) => task.id).join(', '),
      changeBefore: JSON.stringify({
        selectedTasks: selectedTask.map((task) => task.id),
        taskCount: selectedTask.length,
      }),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: `Opening reassign modal for ${selectedTask.length} selected monitoring task(s)`,
    });

    NiceModal.show(MODAL.REASSIGN_TO, {
      divisionId,
      isRiviewAssign: true,
      module: TypeModule.MIP_REVIEW,
      position: TypePosition.STAFF_ESDD,
      process: TypeProcess.REVIEWER_DELST,
      selectedTask, setSelectedTask,
    });
  };

  return {
    canCreateESDDMonitoring,
    canUpdateESDDMonitoring,
    filter,
    filterContentList,
    filterDropdownList,
    handleClickReassignTo,
    isLoading,
    itemPerPage,
    monitoringList,
    monitoringPage,
    page,
    selectedTask,
    setFilter,
    setItemPerPage,
    setPage,
    tableHeaderMonitoring,
  };
};
