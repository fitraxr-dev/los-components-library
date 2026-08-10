'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, ASPECT_LEGAL_REVIEW } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, toDateString } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';


import { useLegalAspectAccess } from '../hooks/useLegalAspectAccess';

import { TABLE_HEADER_MONITORING } from './Monitoring.constants';

import type { Task } from './Monitoring.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useMonitoring = () => {
  const router = useCustomRouter();
  const [filter, setFilter] = useSessionStorage('filter-component-aspect-monitoring', null);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [selectedTask, setSelectedTask] = useState<Array<Task>>([]);
  const [divisionId, setDivisionId] = useState('');
  const path = usePathname();
  const pathModule = getLastPath(path);
  const [{ currentRole }] = useApp();
  const isChecker = currentRole?.includes(roles.CHECKER);
  const canViewAspectLegal = useCheckAccess(accessid.MONITORING_LEGAL_ASPECT_REVIEW_VIEW);
  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusMIPReviewDHList');
  const { data: searchByOptions } = useGetParameterList('searchByMIPReviewDHList', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByMIPReviewDHList', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  // --- END OF PARAMETER ---

  const {
    hasAnyUpdateAccess: canUpdate,
  } = useLegalAspectAccess();
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
      process: TypeProcess.REVIEWER_DH,
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
    createdAt: content.createdAt,
    debtorName: content.debtorName ?? '-',
    division: content.division ?? '-',
    divisionId: content.divisionId ?? '-',
    dueDate: content.dueDate,
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
  const INITIAL_VALUES = {
    endDate: '',
    list: [],
    permanentDate: false,
    staffList: [],
    startDate: '',
  };


  const validationSchema = yup.object({
    endDate: yup.string(),
    list: yup.array(),
    permanentDate: yup.bool(),
    staffList: yup.array(),
    startDate: yup.string(),
  });
  const { control, watch, setValue, handleSubmit } = useForm({
    defaultValues: INITIAL_VALUES,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

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
      key: 'id',
      label: 'ID',
      sx: {
        minWidth: '8vw',
      },
    },
    {
      key: 'institutionTypeLabel',
      label: 'Tipe Institusi',
      sx: { minWidth: '7.5vw' },
    },
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
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: {
        minWidth: '7vw',
      },
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
        ...(canViewAspectLegal ? [{
          iconName: 'detail',
          onClick: (data) => {
            router.push(replacePath(
              ASPECT_LEGAL_REVIEW.DEBTOR_INFORMATION_PAGE,
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
      type: 'action',
    },
  ];

  const handleClickReassignTo = () => {
    NiceModal.show(MODAL.REASSIGN_TO, {
      divisionId,
      isRiviewAssign: true,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
      selectedTask,
      setSelectedTask,
    });
  };

  return {
    canUpdate,
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
