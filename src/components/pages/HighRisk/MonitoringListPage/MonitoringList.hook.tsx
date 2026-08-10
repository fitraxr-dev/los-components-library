'use client';
import React, { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { accessid, highRisk } from '@/configs/constants/pathname';
import { TypeDivision } from '@/enums/Division';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { MODAL } from './MonitoringList.contant';

import type { Task } from './Monitoring.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useMonitoringList = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const pathModule = getLastPath(path);

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [divisionId, setDivisionId] = useState('');
  const [selectedTask, setSelectedTask] = useState([]);
  const [{ currentRole }] = useApp();
  const isChecker = currentRole?.includes(roles.CHECKER);

  const canViewMonitoring = useCheckAccess(accessid.HIGH_RISK_MONITORING_LIST_VIEW);

  const { data: highRiskStatusOptions } = useGetParameterList('hrStatusFilter', { label: 'value1', value: 'value2' });
  const { data: searchByOptions } = useGetParameterList('searchByHr', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByHr', { label: 'value1', value: 'value2' });
  const { data: divisionList } = useGetParameterList('division', { label: 'value1', value: 'value2' });

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
      placeholder1: 'Start Aging',
      placeholder2: 'End Aging',
      startKey: 'startAging',
      type: 'textPeriod',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionList,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: highRiskStatusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const { data: monitoringData, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const monitoringList = monitoringData?.contents.map((content) => ({
    aging: content.aging,
    bucketMaster: content.bucketMaster,
    createdAt: content.createdAt,
    debtorName: content.debtorName ?? '-',
    division: content.staffDivisionLabel ?? '-',
    dueDate: content.dueDate,
    id: content.bucketProcessId,
    institutionTypeLabel: content.institutionTypeLabel,
    modifiedAt: content.modifiedAt,
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
    rmName: content.staffName ?? '-',
    statusLabel: content.statusLabel ?? '-',
  }));

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
        setDivisionId(TypeDivision.DK_DIVISION);
        if (selectedTask.some((item) => item.id === data.id)) {
          setSelectedTask(selectedTask.filter((item) => item.id !== data.id));
        } else {
          setSelectedTask([
            ...selectedTask, data].sort(
            (a: Task, b: Task) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
          ));
        }
      },
      sx: { minWidth: '3.6vw' },
      type: 'checkbox' as const,
    }]),
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
      sx: { minWidth: '10vw' },
    },
    {
      key: 'id',
      label: 'ID',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'institutionTypeLabel',
      label: 'Tipe Institusi',
      sx: { minWidth: '13vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '13vw' },
    },
    {
      key: 'division',
      label: 'Divisi',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'rmName',
      label: 'Nama Staff',
      sx: { minWidth: '13vw' },
    },
    {
      key: 'pic',
      label: 'PIC',
      render: (row) => (
        <ColumnWrapper gap={0.5}>
          {
            row.pic.length !== 0 ? row?.pic?.map((item, idx: number) => {
              return (
                <TextStyle key={idx} weight={item.isLeader ? 600 : 400}>
                  {item.name}
                </TextStyle>
              );
            }) : (
              <TextStyle weight={400}>
                -
              </TextStyle>
            )
          }
        </ColumnWrapper>
      ),
      sx: { minWidth: '13vw' },
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
      sx: { minWidth: '16vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewMonitoring ? [{
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(highRisk.MONITORING_DEBTOR_INFORMATION_PAGE, {
              module: pathModule,
              processId: data.id,
            });
            router.push(nextPath);
          },
        }] : [])
      ],
      sx: {
        minWidth: '6vw',
      },
      type: 'action',
    },
  ];

  const handleClickReassignTo = () => {
    NiceModal.show(MODAL.REASSIGN_TO, {
      divisionId,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
      selectedTask, setSelectedTask,
    });
  };

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleClickReassignTo,
    isLoading,
    monitoringList,
    monitoringPage,
    page,
    selectedTask,
    setFilter,
    setPage,
    setPageSize,
    setSelectedTask,
    tableHeaderMonitoring,
  };
};

export default useMonitoringList;
