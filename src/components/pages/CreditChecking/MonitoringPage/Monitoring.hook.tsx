'use client';
import React, { useEffect, useState } from 'react';


import NiceModal from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, creditChecking } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { mockTableDataMonitoring } from './__mock_data__';
import { TABLE_HEADER_MONITORING } from './Monitoring.constants';

import type { Task } from './Monitoring.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useMonitoring = () => {
  const { filterStatusCreditChecking } = useCreditCheckingContext();
  const router = useCustomRouter();
  const [filter, setFilter] = useSessionStorage('filter-component-cc-monitoring', null);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [selectedTask, setSelectedTask] = useState<Array<Task>>([]);
  const [divisionId, setDivisionId] = useState('');
  const [{ currentRole }] = useApp();
  const isChecker = currentRole?.includes(roles.CHECKER);

  const canViewCreditChecking = useCheckAccess(accessid.MONITORING_CREDIT_CHECKING_VIEW);
  const { data: searchByOptions } = useGetParameterList('searchByBucketCreditChecking', {
    label: 'value1',
    value: 'value2',
  });
  const { data: filterStatusByOptions } = useGetParameterList(filterStatusCreditChecking, {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByBucketCreditChecking', {
    label: 'value1',
    value: 'value2',
  });

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
      options: filterStatusByOptions,
      type: filterStatusByOptions.length > 10 ? 'multiple-autocomplete' : 'multiple-select',
    },
  ];

  const { data: monitoringData, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeProcess.CREDIT_CHECKING,
      process: TypeProcess.CREDIT_CHECKING_DPOP,
    },
    page: {
      itemPerPage,
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
    createdAt: content.createdAt,
    debtorName: content.debtorName ?? '-',
    division: content.staffDivisionLabel ?? '-',
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

  // const monitoringPage = mockTableDataMonitoring?.page;
  const totalPage = monitoringData?.page?.totalPage ?? 1;

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
        minWidth: '7vw',
      },
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: {
        minWidth: '8vw',
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
      key: 'status',
      label: 'Status',
      sx: {
        minWidth: '10vw',
      },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewCreditChecking ? [{
          iconName: 'detail', onClick: (data) => {
            router.push(replacePath(
              creditChecking.MONITORING_DEBTOR_INFORMATION_PAGE,
              {
                processId: data.id,
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
    NiceModal.show(
      MODAL.REASSIGN_TO,
      {
        divisionId,
        isRiviewAssign: true,
        module: TypeModule.CREDIT_CHECKING,
        process: TypeProcess.CREDIT_CHECKING_DPOP,
        selectedTask,
        setSelectedTask,
      }
    );
  };

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleClickReassignTo,
    isLoading,
    itemPerPage,
    monitoringList,
    monitoringPage: { totalPage },
    page,
    selectedTask,
    setFilter,
    setItemPerPage,
    setPage,
    tableHeaderMonitoring,
  };
};
