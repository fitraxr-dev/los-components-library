'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, legalSigning } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';

import { TABLE_HEADER_MONITORING } from './Monitoring.constants';

import type { Task } from './Monitoring.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useMonitoring = () => {
  const router = useCustomRouter();
  const [filter, setFilter] = useSessionStorage('filter-component-legalsigning-assignment', null);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [selectedTask, setSelectedTask] = useState<Array<Task>>([]);
  const [divisionId, setDivisionId] = useState('');
  const path = usePathname();
  const pathModule = getLastPath(path);
  const [{ currentRole }] = useApp();
  const isChecker = currentRole?.includes(roles.CHECKER);
  const canViewMonitoringLegalSigning = useCheckAccess(accessid.LEGAL_SIGING_MONITORING_VIEW);

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusPKDHList', { label: 'value1', value: 'key' });
  const { data: searchByOptions } = useGetParameterList('searchByPKList', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByPKList', { label: 'value1', value: 'value2' });
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
      endKey: 'endDateAging',
      label: 'Aging',
      startKey: 'startDateAging',
      type: 'period',
    },
    {
      endKey: 'endDueDate',
      label: 'Due Date',
      startKey: 'startDueDate',
      type: 'period',
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

  const handleOpenModalStatusPk = (bucketId: string) => NiceModal.show(MODAL.STATUS_PK, {
    id: bucketId,
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.PROCESSING_TYPE_PK,
  });


  const { data: monitoringData, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.LEGAL_SIGNING,
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
    bucketProcessId: content.bucketProcessId ?? '-',
    createdAt: content.createdAt,
    debtorName: content.debtorName ?? '-',
    division: content.division ?? '-',
    divisionId: content.divisionId ?? '-',
    dueDate: content.dueDate,
    id: content.bucketProcessId,
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
    status: content.statusLabel ?? '-',
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
      isDisabled: (data) => {
        const isCurrentItemSelected = selectedTask.some(
          (item) => item.id === data.id
        );
        const hasReachedLimit = selectedTask.length >= 5;

        return hasReachedLimit && !isCurrentItemSelected;
      },
      isSelected: (data) => selectedTask.some((item) => item.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        setDivisionId(data.divisionId);
        if (selectedTask.some((item) => item.id === data.id)) {
          setSelectedTask(selectedTask.filter((item) => item.id !== data.id));
        } else {
          if (selectedTask.length < 5) {
            setSelectedTask([
              ...selectedTask, data]
              .sort(
                (a: Task, b: Task) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
              ));
          }
        }
      },
      sx: { minWidth: '3.6vw' },
      type: 'checkbox' as const,
    }]),
    ...TABLE_HEADER_MONITORING,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ borderRadius: '12px', px: 1, py: 0.5 }}
          textVariant="body4"
          color="primary"
          noClick
        >
          {row.status}
        </Button>
      ),
      sx: {
        minWidth: '20vw',
      },
    },
    {
      key: 'statusLabel',
      label: 'Status PK',
      render: (row) => (
        <Button
          sx={{ borderRadius: '7px', px: 3, py: 1.5 }}
          textVariant="button"
          startIcon="monitor"
          onClick={handleOpenModalStatusPk.bind(null, row?.bucketParentId)}
        >
          View Status PK
        </Button>
      ),
      sx: { minWidth: '17vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewMonitoringLegalSigning ? [{
          iconName: 'detail', onClick: (data) => {
            router.push(replacePath(
              legalSigning.DEBTOR_INFORMATION_PAGE,
              {
                module: pathModule,
                processId: data.bucketProcessId,
              },
            ));
          },
        }] : []),
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
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.LEGAL_SIGNING,
      selectedTask, setSelectedTask,
    });
  };

  return {
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
