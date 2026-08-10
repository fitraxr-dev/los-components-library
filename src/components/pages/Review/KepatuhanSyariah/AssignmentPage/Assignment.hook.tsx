'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { accessid, KEPATUHAN_SYARIAH } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, toDateString } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketListAssignment from '@/hooks/services/useGetBucketListAssignment';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';
import TextStyle from '@/components/shared/TextStyle';

import { useShariahComplianceAccess } from '../hooks/useShariahComplianceAccess';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useAssignment = () => {
  const [filter, setFilter] = useSessionStorage('filter-component-dk-assignment', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [state, setState] = useState();
  const [permanent, setPermanent] = useState(false);
  const [selectedTask, setSelectedTask] = useState([]);
  const [division, setDivision] = useState('');
  const canViewKepatuhan = useCheckAccess(accessid.SHARIAH_COMPLIANCE_REVIEW_ASSIGNMENT_VIEW);
  const path = usePathname();
  const pathModule = getLastPath(path);

  const router = useCustomRouter();

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusMIPReviewDKStaffAssignmentList');
  const { data: searchByOptions } = useGetParameterList('searchByMIPReviewDKList', {
    label: 'value1', value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByMIPReviewDKList', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  // --- END OF PARAMETER ---


  const {
    hasAnyUpdateAccess: canUpdate,
  } = useShariahComplianceAccess();

  const { data, isLoading } = useGetBucketListAssignment({
    filter: {
      ...filter?.filter,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
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
        title: 'Assignment Maximum 5 Task',
      });
      return;
    }

    setDivision(data.divisionId);

    if (selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId)) {
      setSelectedTask(selectedTask.filter((item) => item.bucketProcessId !== data.bucketProcessId));
    } else {
      setSelectedTask([...selectedTask, {
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
        ...(canViewKepatuhan ? [{
          iconName: 'detail', onClick: (row) => {
            router.push(replacePath(
              KEPATUHAN_SYARIAH.DEBTOR_INFORMATION_PAGE,
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

  const handleClickAssign = () => {
    NiceModal.show(MODAL.ASSIGN_TO, {
      isRiviewAssign: true,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
      selectedTask,
      setSelectedTask,
    });
  };

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

  return {
    canUpdate,
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
