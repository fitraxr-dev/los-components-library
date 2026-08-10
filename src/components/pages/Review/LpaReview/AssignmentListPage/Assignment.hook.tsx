'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { lpaReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketListAssignment from '@/hooks/services/useGetBucketListAssignment';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { tableHeaderResultList } from './Assignment.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useAssignment = () => {
  const [filter, setFilter] = useSessionStorage('filter-component-lpa-assignment', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [state, setState] = useState();
  const [permanent, setPermanent] = useState(false);
  const [selectedTask, setSelectedTask] = useState([]);
  const [divisionId, setDivisionId] = useState('');
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const path = usePathname();
  const pathModule = getLastPath(path);


  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusLPAReviewAssigmentList');
  const { data: divisionOptions } = useGetParameterList('division');
  const { data: searchByOptions } = useGetParameterList('searchByLPAListAssignment', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByLPAList', {
    label: 'value1',
    value: 'value2',
  });
  // --- END OF PARAMETER ---


  const { data, isLoading } = useGetBucketListAssignment({
    filter: {
      ...filter?.filter,
      module: TypeModule.LPA,
      process: TypeProcess.LPA_REVIEW,
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

  // Record activity when assignment list is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: TypeModule.LPA,
        process: TypeProcess.LPA_REVIEW,
        remarks: 'view lpa review assignment list',
      });
    }
  }, [data, recordActivity]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selectedTask.some((item) => item.bucketProcessId === data.bucketProcessId)) {
          setSelectedTask(selectedTask.filter((item) => item.bucketProcessId !== data.bucketProcessId));
        } else {
          setSelectedTask([...selectedTask, {
            bucketProcessId: data.bucketProcessId,
            debtorName: data.debtorName,
            division: data.division,
            divisionId: data.divisionId,
            staffDivision: data.staffDivision,
            staffDivisionLabel: data.staffDivisionLabel,
            staffName: data.staffName,
          }]);
        }
      },
      sx: { width: '4%' },
      type: 'checkbox',
    },
    ...tableHeaderResultList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (row) => {
            // Record activity for viewing assignment detail
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: row.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'lpa-review',
              module: TypeModule.LPA,
              process: TypeProcess.LPA_REVIEW,
              remarks: `view lpa review assignment detail (processId: ${row.bucketProcessId})`,
            });

            router.push(replacePath(
              lpaReview.DEBTOR_INFORMATION,
              {
                module: pathModule,
                processId: row.bucketProcessId,
              },
            ));
          },
        },
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


  const handleClickAssign = () => {
    NiceModal.show(MODAL.ASSIGN_TO, {
      module: TypeModule.LPA,
      position: 'Staff_PJ_LPA',
      process: TypeProcess.LPA_REVIEW,
      selectedTask,
      setSelectedTask,
    });
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
