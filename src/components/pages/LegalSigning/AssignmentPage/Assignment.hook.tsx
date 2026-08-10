'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { accessid, legalSigning } from '@/configs/constants/pathname';
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

import { TABLE_HEADER } from './Assignment.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useAssignment = () => {
  const [filter, setFilter] = useSessionStorage('filter-component-legalsigning-assignment', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [state, setState] = useState();
  const [permanent, setPermanent] = useState(false);
  const [selectedTask, setSelectedTask] = useState([]);
  const [divisionId, setDivisionId] = useState('');
  const router = useCustomRouter();
  const path = usePathname();
  const pathModule = getLastPath(path);
  const canViewAssignmentLegalSigning = useCheckAccess(accessid.LEGAL_SIGING_ASSIGNMENT_VIEW);

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusPKDHList', { label: 'value1', value: 'key' });
  const { data: searchByOptions } = useGetParameterList('searchByPKList', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByPKList', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  // --- END OF PARAMETER ---


  const { data, isLoading } = useGetBucketListAssignment({
    filter: {
      ...filter?.filter,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.LEGAL_SIGNING,
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
  }));

  const processPage = data?.page;

  useEffect(() => {
    setPage(1);
  }, [filter]);


  const tableHeader: TableHeader[] = [
    {
      isDisabled: (data) => {
        const isCurrentItemSelected = selectedTask.some(
          (item) => item.bucketProcessId === data.bucketProcessId
        );
        const hasReachedLimit = selectedTask.length >= 5;

        return hasReachedLimit && !isCurrentItemSelected;
      },
      isSelected: (data) => selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId),
      key: 'checkbox',
      onSelectChange: (data) => {
        setDivisionId(data.divisionId);
        if (selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId)) {
          setSelectedTask(selectedTask.filter((item) => item.bucketProcessId !== data.bucketProcessId));
        } else {
          if (selectedTask.length < 5) {
            setSelectedTask([...selectedTask, {
              bucketProcessId: data.bucketProcessId,
              debtorName: data.debtorName,
              divisionId: data.divisionId,
              staffDivisionLabel: data.staffDivisionLabel,
              staffName: data.staffName,
            }]);
          }
        }
      },
      sx: { width: '4%' },
      type: 'checkbox',
    },
    ...TABLE_HEADER,
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
          {row.statusLabel ?? '-'}
        </Button>
      ),
      sx: { minWidth: '12vw' },
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
        ...(canViewAssignmentLegalSigning ? [{
          iconName: 'detail', onClick: (row) => {
            router.push(replacePath(
              legalSigning.DEBTOR_INFORMATION_PAGE,
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

  const handleClickAssign = () => {
    NiceModal.show(MODAL.ASSIGN_TO, {
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.LEGAL_SIGNING,
      selectedTask, setSelectedTask });
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
