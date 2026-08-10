'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { accessid, creditChecking } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { TypePosition } from '@/enums/Position';
import { formatDate, toDateString } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import TextStyle from '@/components/shared/TextStyle';

import useGetAssignmentList from './hooks/useGetAssignmentList';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useAssignment = () => {
  const { filterStatusCreditChecking } = useCreditCheckingContext();
  const [filter, setFilter] = useSessionStorage('filter-component-cc-assignment', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [state, setState] = useState();
  const [permanent, setPermanent] = useState(false);
  const [selectedTask, setSelectedTask] = useState([]);
  const router = useCustomRouter();
  const canViewCreditChecking = useCheckAccess(accessid.ASSIGNMENT_CREDIT_CHECKING_VIEW);
  const { data: sortByOptions } = useGetParameterList('sortByBucketCreditChecking', {
    label: 'value1',
    value: 'value2',
  });
  const { data: searchByOptions } = useGetParameterList('searchByBucketCreditChecking', {
    label: 'value1',
    value: 'value2',
  });
  const { data: statusByOptions } = useGetParameterList(filterStatusCreditChecking, {
    label: 'value1',
    value: 'value2',
  });

  const { data, isLoading } = useGetAssignmentList({
    filter: {
      ...(filter?.filter ?? {}),
      module: TypeModule.CREDIT_CHECKING,
      process: TypeProcess.CREDIT_CHECKING_DPOP,
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
    status: process.statusLabel ?? '-',
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
      key: 'status',
      label: 'Status',
      sx: { minWidth: '10vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewCreditChecking ? [{
          iconName: 'detail', onClick: (row) => {
            router.push(replacePath(
              creditChecking.ASSIGNMENT_DEBTOR_INFORMATION_PAGE,
              {
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
      key: 'status',
      label: 'Status',
      options: statusByOptions,
      type: statusByOptions.length > 10 ? 'multiple-autocomplete' : 'multiple-select',
    },
  ];

  const handleClickAssign = () => {
    NiceModal.show(
      MODAL.ASSIGN_TO,
      {
        isRiviewAssign: true,
        module: TypeModule.CREDIT_CHECKING,
        position: `${TypePosition.RM},${TypePosition.FM},${TypePosition.STAFF_FM}`,
        process: TypeProcess.CREDIT_CHECKING_DPOP,
        selectedTask: selectedTask,
        setSelectedTask: setSelectedTask,
      }
    );
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
