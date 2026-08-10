import { useEffect, useState } from 'react';

import { ActivityType } from '@/enums/Activity';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useRecordLog from '@/hooks/useRecordLog';

import useGetMonitoringCustomerDetail from './hooks/useGetMonitoringCustomerDetail';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useInformationCustomer = (modalId: string, rowData?: any) => {
  const { recordActivity } = useRecordLog();

  const [filter, setFilter] = useState({
    filter: {},
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Get all debtor data
  const { data, isLoading } = useGetMonitoringCustomerDetail({
    filter: {
      ...filter?.filter,
      debtorId: rowData?.debtorId ?? '',
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  }, {
    enabled: true,
  });

  const tablePage = data?.data?.page ?? data?.page;
  const tableData = (data?.data?.contents ?? data?.contents ?? []).map((item) => ({
    ...item,
    cif: item?.cif ?? '-',
    debtorId: item?.debtorId ?? '-',
  }));


  // Map debtor data
  useEffect(() => {
    // Reset page to 1
    setPage(1);
  }, [filter]);

  // Reset filter when modal opens
  useEffect(() => {
    setFilter({
      filter: {},
      searchDetail: { key: '', value: '' },
      sortList: undefined,
    });
    setPage(1);
  }, []);

  // Record activity when data is loaded
  useEffect(() => {
    if (data && !isLoading && rowData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: rowData?.bucketProcessId || '',
        module: 'MONITORING',
        process: 'CUSTOMER_MONITORING',
        remarks: `view customer monitoring detail modal: ${rowData?.debtorName || 'N/A'} (ID: ${rowData?.debtorId || 'N/A'})`,
      });
    }
  }, [data, isLoading, rowData, recordActivity]);


  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4vw' },
      type: 'index',
    },
    {
      key: 'processLabel',
      label: 'Proses',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'divisionLabel',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'staffName',
      label: 'PIC',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: { minWidth: '10vw' },
      type: 'status',
    },
    {
      key: 'createdDate',
      label: 'Start Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
  ];


  return {
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    tablePage,
  };
};
