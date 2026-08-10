import { useEffect, useState } from 'react';


import { lpaRequestReview, lpaReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useGetCurrentModule from '../hooks/useGetCurrentModule';

import { tableHeaderResultList } from './RequestList.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useRequestList = () => {
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const { module, process } = useGetCurrentModule();

  const handleToDetailPage = (id: string) => {
    // Record activity for viewing detail
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: id || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'lpa-review',
      module: module,
      process: process,
      remarks: `view lpa request detail (bucketProcessId: ${id})`,
    });

    switch (process) {
      case TypeProcess.LPA_REVIEW:
        return router.push(replacePath(lpaReview.DEBTOR_INFORMATION, { module: 'bucket-list', processId: id }));
      default:
        return router.push(replacePath(lpaRequestReview.DEBTOR_INFORMATION, { module: 'bucket-list', processId: id }));
    }
  };


  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusLPAList');
  const { data: divisionOptions } = useGetParameterList('division');
  const { data: searchByOptions } = useGetParameterList('searchByLPAList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByLPAList', {
    label: 'value1',
    value: 'value2',
  });
  // --- END OF PARAMETER ---

  const [filter, setFilter] = useState<SearchValue>({});

  useEffect(() => {
    setNoPage(1);
  }, [filter]);

  const { data, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module,
      process,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  // Record activity when request list is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'view lpa request list page',
      });
    }
  }, [data, module, process, recordActivity]);

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

  const tableHeader: Array<TableHeader> = [
    ...tableHeaderResultList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => handleToDetailPage(data.bucketProcessId),
        },
      ],
      sx: {
        minWidth: '6vw',
        textAlign: 'center',
      },
      type: 'action',
    },
  ];


  return {
    data,
    filter,
    filterContentList,
    filterDropdownList,
    handleToDetailPage,
    isLoading,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};

export default useRequestList;
