import React, { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { accessid, highRisk } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketListAssignment from '@/hooks/services/useGetBucketListAssignment';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';

import TextStyle from '@/components/shared/TextStyle';

import { ASSIGNMENT } from './AssignmentList.contant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useAssignmentList = () => {
  const router = useCustomRouter();

  const [filter, setFilter] = useState(null);
  const [selectedTask, setSelectedTask] = useState([]);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const canViewAssignment = useCheckAccess(accessid.HIGH_RISK_ASSIGNMENT_LIST_VIEW);

  const { data: highRiskStatusOptions } = useGetParameterList ('hrStatusFilter', { label: 'value1', value: 'value2' });
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


  const { data: bucketData, isPending: isLoading } = useGetBucketListAssignment({
    filter: {
      ...filter?.filter,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const handleOpenAssignModal = () => {
    NiceModal.show(ASSIGNMENT.ASSIGN_TO,
      {
        module: TypeModule.HIGH_RISK,
        process: TypeProcess.HIGH_RISK_DK,
        selectedTask, setSelectedTask,
      });
  };

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId)) {
          setSelectedTask(selectedTask.filter((item) => item.bucketProcessId !== data.bucketProcessId));
        } else {
          setSelectedTask([...selectedTask, data]);
        }
      },
      sx: { width: '4%' },
      type: 'checkbox',
    },
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
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'institutionTypeLabel',
      label: 'Tipe Institusi',
      sx: { minWidth: '15vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '13vw' },
    },
    {
      key: 'staffDivisionLabel',
      label: 'Divisi',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
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
        ...(canViewAssignment ? [{
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(highRisk.ASSIGNMENT_DEBTOR_INFORMATION_PAGE, {
              processId: data?.bucketProcessId,
            });
            router.push(nextPath);
          },
        }] : [])
      ],
      sx: { minWidth: '5vw' },
      type: 'action',
    },
  ];

  const tableData = bucketData?.contents;
  const totalPage = bucketData?.page?.totalPage;

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleOpenAssignModal,
    isLoading,
    itemPerPage,
    page,
    searchByOptions,
    selectedTask,
    setFilter,
    setItemPerPage,
    setPage,
    tableData,
    tableHeader,
    totalPage,
  };
};
