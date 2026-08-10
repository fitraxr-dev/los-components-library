'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { technicalStudyReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { FILTER_OPTIONS, SORT_OPTIONS } from '../mockData/mockData';

import { TABLE_HEADER_MONITORING } from './Monitoring.constants';

import type { Task } from './Monitoring.types';
import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useMonitoring = () => {
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const [filter, setFilter] = useState<SearchValue>(null);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [selectedTask, setSelectedTask] = useState<Array<Task>>([]);
  const [divisionId, setDivisionId] = useState<String>('');
  const [{ currentRole }] = useApp();
  const isChecker = currentRole?.includes(roles.CHECKER);


  const { data: searchByOptions } = useGetParameterList('searchByBucketMonitoring', { label: 'value1', value: 'value2' });
  const { data: filterStatusByOptions } = useGetParameterList('filterStatusTechnicalReviewDelst');
  const { data: sortByOptions } = useGetParameterList('orderByBucketMonitoring', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('division');

  const isMaker = currentRole?.includes(roles.MAKER);

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? SORT_OPTIONS,
      type: 'sort',
    },
    {
      key: 'status',
      label: 'Status',
      options: filterStatusByOptions ?? FILTER_OPTIONS,
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

  const defaultStatusesMaker = ['WAITING_APPROVAL_KADIV_DELST', 'WAITING_ASK_FOR_INFO_KADIV_DELST'];
  const defaultStatuses = ['WAITING_APPROVAL_KADIV_DELST', 'WAITING_ASK_FOR_INFO_KADIV_DELST', 'WAITING_APPROVAL_CHECKER', 'WAITING_ASK_FOR_INFO_CHECKER'];

  const { data: monitoringData, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.TECHNICAL_REVIEW as any,
      process: TypeProcess.TECHNICAL_REVIEW_DELST as any,
      ...(filter?.filter?.status || filter?.searchDetail?.value ? {}
        : isMaker ? { status: defaultStatusesMaker } : { status: defaultStatuses }),
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  // Record activity when monitoring list is loaded
  useEffect(() => {
    if (monitoringData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: TypeModule.TECHNICAL_REVIEW,
        process: TypeProcess.TECHNICAL_REVIEW_DELST,
        remarks: 'view technical study review monitoring list',
      });
    }
  }, [monitoringData, recordActivity]);

  useEffect(() => {
    setPage(1);
  }, [filter]);


  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
      },
    }));
  }, []);

  const monitoringList = monitoringData?.contents.map((content) => ({
    aging: content.aging ?? '-',
    bucketMaster: content.bucketMaster ?? '-',
    createdAt: content.createdAt ?? '-',
    debtorName: content.debtorName ?? '-',
    division: content.division ?? '-',
    divisionId: content.divisionId ?? '',
    dueDate: content.dueDate ? formatDateTime(content.dueDate) : '-',
    id: content.bucketProcessId,
    institutionTypeLabel: content.institutionTypeLabel ?? '-',
    modifiedAt: content.modifiedAt ?? '-',
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
    staffDivisionLabel: content.staffDivisionLabel ?? '-',
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


  const tableHeaderMonitoring: TableHeader[] = [
    ...(isChecker ? [] : [{
      isDisabled: () => false,
      isSelected: (data) => selectedTask.some((item) => item.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
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
      sx: { textAlign: 'center', width: '4%' },
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
      sx: { minWidth: '14vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            // Record activity for viewing monitoring detail
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: data.id || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'technical-study-review',
              module: TypeModule.TECHNICAL_REVIEW,
              process: TypeProcess.TECHNICAL_REVIEW_DELST,
              remarks: `view technical study review monitoring detail (processId: ${data.id})`,
            });

            router.push(replacePath(
              technicalStudyReview.DEBTOR_INFORMATION_PAGE,
              {
                module: 'monitoring',
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
    NiceModal.show(
      MODAL.REASSIGN_TO,
      {
        divisionId,
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
    handleClickReassignTo,
    isLoading,
    itemPerPage,
    monitoringData,
    monitoringList,
    page,
    selectedTask,
    setFilter,
    setItemPerPage,
    setPage,
    tableHeaderMonitoring,
  };
};
