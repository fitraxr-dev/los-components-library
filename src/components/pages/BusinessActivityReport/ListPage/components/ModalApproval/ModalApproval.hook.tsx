import { useEffect, useState } from 'react';

import { businessActivityReport } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { HEADER_TABLE } from './ModalApproval.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalApproval = (modalId: string) => {
  const [contentList, setContentList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filter, setFilter] = useState(null);
  const route = useCustomRouter();
  const { recordActivity } = useRecordLog();

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusBar');
  const { data: searchByOptions } = useGetParameterList('searchByBarApproval', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByBar', { label: 'value1', value: 'value2' });

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'callEndDate',
      key: 'callDate',
      label: 'Periode Call Date',
      startKey: 'callStartDate',
      type: 'period',
    },
    {
      endKey: 'endDate',
      key: 'createdDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const { data, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
      status: filter?.filter?.status || ['WAITING_APPROVAL_KADIV', 'WAITING_APPROVAL_CHECKER'],
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: { ...filter?.searchDetail },
    sortList: { ...filter?.sortList },
  });

  const tableHeader: TableHeader[] = [
    ...HEADER_TABLE,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            route.push(replacePath(businessActivityReport.INFORMATION, {
              processId: data.bucketProcessId,
            }));
            closeNiceModal(modalId);
          },
        },
      ],
      type: 'action',
    },
  ];

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'business-activity-report',
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
      remarks: 'view list approval business activity report',
    });
  }, []);

  return {
    contentList,
    data,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useModalApproval;
