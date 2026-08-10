'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { spfp } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';


import { TABLE_HEADER_MONITORING } from './Monitoring.constants';

import type { Task } from './Monitoring.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useMonitoring = () => {
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const [filter, setFilter] = useSessionStorage('filter-component-spfp-monitoring', null);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [selectedTask, setSelectedTask] = useState<Array<Task>>([]);
  const path = usePathname();
  const pathModule = getLastPath(path);
  const [divisionId, setDivisionId] = useState('');
  const [{ userData }] = useApp();
  const userDivision = (userData?.user as any)?.accessManagementActive?.userDivision ||
    (userData?.user as any)?.userDivision ||
    (userData as any)?.userDivision;
  const division = userData?.user?.division;
  const isDpop = userDivision?.divisionCode?.includes('DPOP') ||
    division?.some((div) => div?.divisionCode?.includes('DPOP'));
  const [{ currentRole }] = useApp();
  const isChecker = currentRole?.includes(roles.CHECKER);


  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('spfpStatusFilter');
  const { data: searchByOptions } = useGetParameterList(isDpop ? 'searchBySpfpDpop' : 'searchBySpfp', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortBySpfp', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('divisionOptionsSpdp', { label: 'value1', value: 'value2' });
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

  const { data: monitoringData, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.SPFP,
      // process: isDpop ?
      //   `${TypeProcess.SPDP}|${TypeProcess.SPFP_FINAL}` :
      //   `${TypeProcess.SPFP}|${TypeProcess.SPFP_FINAL}`,
      process: TypeProcess.SPDP,
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
    division: content.division ?? '-',
    // dueDate: content.dueDate ?? '-', // TODO: Check if '-' is correct for date type
    id: content.bucketProcessId,
    pic: content.pic?.map((item) => ({
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
    staffDivisionLabel: content.staffDivisionLabel ?? '-',
    status: content.statusLabel ?? '-',
  }));

  if (monitoringList) {
    monitoringList.forEach((item) => {
      const { pic } = item;
      let leaderIndex = pic?.findIndex((picObj) => picObj.isLeader === true);
      if (leaderIndex !== -1) {
        let leaderObj = item?.pic?.splice(leaderIndex, 1)[0];
        pic?.unshift(leaderObj);
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
        setDivisionId('DPOP_DIVISION');
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
    ...TABLE_HEADER_MONITORING,
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
          row.dueDate && row.dueDate !== '-'
            ? formatDate(row.dueDate, 'DD MMM YYYY, HH:mm:ss')
            : '-'
        ),
      sx: { minWidth: '13vw' },
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
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          color="primary"
          noClick
        >
          {row.status}
        </Button>
      ),
      sx: {
        minWidth: '14vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: data.id || '',
              changeAfter: '',
              changeBefore: '',
              module: TypeModule.SPFP,
              process: TypeProcess.SPDP,
              remarks: `view detail monitoring task: ${data.id} (debtor: ${data.debtorName || 'N/A'})`,
            });
            router.push(replacePath(
              spfp.DEBTOR_INFORMATION_PAGE,
              {
                module: pathModule,
                processId: data.id,
              },
            ));
          },
        },
      ],
      sx: {
        minWidth: '6vw',
      },
      type: 'action',
    },
  ];

  const handleClickReassignTo = () => {
    if (selectedTask.length > 0) {
      const first = selectedTask[0];
      const firstSplit = first.id.split('-');
      const isDifferentBucket = selectedTask.some((val, idx) => {
        if (idx === 0) {
          return false;
        } else {
          return firstSplit[0] !== val.id.split('-')[0];
        }
      });
      if (isDifferentBucket) {
        recordActivity({
          activity: ActivityType.VIEW,
          bucketProcessId: '',
          changeAfter: '',
          changeBefore: '',
          module: TypeModule.SPFP,
          process: TypeProcess.SPDP,
          remarks: 'attempt to reassign tasks from different buckets (failed)',
        });
        showNiceModalV2({
          onClose: () => {
            return;
          },
          title: 'Pilihan tidak boleh berisi dari dua proses yang berbeda',
          type: 'error',
        });
        return;
      } else {
        recordActivity({
          activity: ActivityType.VIEW,
          bucketProcessId: first.id || '',
          changeAfter: '',
          changeBefore: '',
          module: TypeModule.SPFP,
          process: firstSplit[0] === 'SPF' ? TypeProcess.SPFP_FINAL : TypeProcess.SPDP,
          remarks: `open reassign modal for ${selectedTask.length} task(s)`,
        });
        NiceModal.show(MODAL.REASSIGN_TO, {
          divisionId,
          module: TypeModule.SPFP,
          process: firstSplit[0] === 'SPF' ? TypeProcess.SPFP_FINAL : TypeProcess.SPDP,
          selectedTask,
          setSelectedTask,
        });
      }
    }
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
