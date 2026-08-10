'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import {
  BUSINESS_DIVISION,
  DPB_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DUS_DIVISION,
  SECOND_FINANCING_DIVISION,
} from '@/configs/constants/general';
import { ActivityType } from '@/enums/Activity';
import { formatDateTime } from '@/helpers/date';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useDivision from '@/hooks/useDivision';
import useRecordLog from '@/hooks/useRecordLog';

import TextStyle from '@/components/shared/TextStyle';

import useGetCustomerMonitoringList from './hooks/useGetCustomerMonitoringList';
import useGetDivisionList from './hooks/useGetDivisionList';
import useGetProcessList from './hooks/useGetProcessList';
import useGetStatusList from './hooks/useGetStatusList';
import { modalCustomerMonitoring } from './List.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const { divisionCode } = useDivision();
  const { recordActivity } = useRecordLog();

  const [filter, setFilter] = useState<SearchValue>({
    filter: {},
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });
  const [appliedFilter, setAppliedFilter] = useState<SearchValue>({
    filter: {},
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });
  // State untuk tracking selected values real-time (sebelum Apply)
  const [realTimeDivision, setRealTimeDivision] = useState<string[]>([]);
  const [realTimeProcess, setRealTimeProcess] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [state, setState] = useState();

  // Ref untuk menyimpan previous filter string untuk mencegah infinite loop
  const previousFilterStringRef = useRef<string>('');

  // Check if user is business division
  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_3_DIVISION,
  ];
  const isBusinessDivision = businessDivisionArray.includes(divisionCode);


  // --- PARAMETER ---
  // Get Division filter options - always fetch (always has data)
  const { data: divisionOptions } = useGetDivisionList();

  // Get Process filter options - always fetch (BE handles if division not selected)
  // Fetch with division from real-time state to update dropdown options immediately
  const { data: processOptions } = useGetProcessList({ division: realTimeDivision });

  // Get Status filter options - only fetch if process is selected (null if process empty, not null if process selected)
  // Fetch with process from real-time state to update dropdown options immediately
  const { data: statusOptions } = useGetStatusList({ process: realTimeProcess });

  // Get statusOptions untuk process yang sudah di-apply (bukan real-time)
  // Ini digunakan untuk validasi status yang sudah di-apply
  const { data: appliedStatusOptions } = useGetStatusList({
    process: appliedFilter?.filter?.process && Array.isArray(appliedFilter.filter.process)
      ? appliedFilter.filter.process
      : [],
  });

  const { data: searchByOptions } = useGetParameterList('searchByCustomerMonitoring', { label: 'value1', value: 'value2' });

  const { data: orderByOptions } = useGetParameterList('sortByCustomerMonitoring', { label: 'value1', value: 'value2' });
  // --- END OF PARAMETER ---

  // Validasi dan reset status yang tidak valid saat process atau statusOptions berubah
  // Hanya validasi di appliedFilter, bukan di filter (karena filter hanya berubah saat Apply)
  // Hanya validasi menggunakan statusOptions dari process yang sudah di-apply
  useEffect(() => {
    const currentStatus = appliedFilter?.filter?.status;
    const appliedProcess = appliedFilter?.filter?.process;
    const appliedProcessArray = appliedProcess && Array.isArray(appliedProcess) ? appliedProcess : [];

    // Jika process kosong, hapus semua status dari appliedFilter
    if (appliedProcessArray.length === 0) {
      if (currentStatus && Array.isArray(currentStatus) && currentStatus.length > 0) {
        setAppliedFilter((prev) => {
          // Guard: hanya update jika status masih ada
          if (prev?.filter?.status && Array.isArray(prev.filter.status) && prev.filter.status.length > 0) {
            const newFilter = { ...prev.filter };
            delete newFilter.status;
            return { ...prev, filter: newFilter };
          }
          return prev;
        });
      }
      return;
    }

    // Jika tidak ada status yang dipilih, tidak perlu validasi
    if (!currentStatus || !Array.isArray(currentStatus) || currentStatus.length === 0) {
      return;
    }

    // Validasi hanya menggunakan statusOptions dari process yang sudah di-apply
    // Bukan dari realTimeProcess (statusOptions)
    if (appliedStatusOptions && Array.isArray(appliedStatusOptions) && appliedStatusOptions.length > 0) {
      const validStatusValues = new Set(appliedStatusOptions.map((opt) => String(opt.value)));
      const currentStatusStrings = currentStatus.map(String);

      // Filter status yang valid
      const validStatuses = currentStatusStrings.filter((status) => validStatusValues.has(status));

      // Jika ada status yang tidak valid atau jumlah valid berbeda dengan yang dipilih
      if (validStatuses.length !== currentStatusStrings.length) {
        setAppliedFilter((prev) => {
          // Guard: hanya update jika status masih ada dan berbeda dengan yang valid
          const prevStatus = prev?.filter?.status;
          if (prevStatus && Array.isArray(prevStatus)) {
            const prevStatusStrings = prevStatus.map(String);
            const prevStatusSorted = [...prevStatusStrings].sort().join(',');
            const validStatusSorted = [...validStatuses].sort().join(',');

            // Hanya update jika benar-benar berbeda
            if (prevStatusSorted !== validStatusSorted) {
              const newFilter = { ...prev.filter };

              if (validStatuses.length === 0) {
                // Jika semua status tidak valid, hapus status
                delete newFilter.status;
              } else {
                // Jika ada yang valid, simpan hanya yang valid
                newFilter.status = validStatuses;
              }
              return { ...prev, filter: newFilter };
            }
          }
          return prev;
        });
      }
    }
  }, [appliedFilter?.filter?.process, appliedStatusOptions, appliedFilter?.filter?.status]);

  // Update appliedFilter when filter changes (after Apply button is clicked)
  // Only update if filter actually changed (not just reference)
  useEffect(() => {
    const filterString = JSON.stringify(filter);
    // Hanya update jika filter benar-benar berubah dari nilai sebelumnya
    if (filterString !== previousFilterStringRef.current) {
      previousFilterStringRef.current = filterString;
      setAppliedFilter(filter);
      // Update real-time state dengan applied values
      if (filter?.filter?.division) {
        const divisionValues = Array.isArray(filter.filter.division)
          ? filter.filter.division.map(String)
          : [];
        setRealTimeDivision(divisionValues);
      } else {
        setRealTimeDivision([]);
      }
      if (filter?.filter?.process) {
        const processValues = Array.isArray(filter.filter.process)
          ? filter.filter.process.map(String)
          : [];
        setRealTimeProcess(processValues);
      } else {
        setRealTimeProcess([]);
      }
    }
  }, [filter]);

  // Memoize payload untuk menghindari re-fetch karena object reference berubah
  const payload = useMemo(() => ({
    filter: {
      ...appliedFilter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: appliedFilter?.searchDetail ?? { key: '', value: '' },
    sortList: appliedFilter?.sortList ?? undefined,
  }), [appliedFilter, pageSize, page]);

  const { data: customerMonitoringData, isFetching: isLoading } = useGetCustomerMonitoringList(payload);

  const tablePage = customerMonitoringData?.page || { totalItem: 0, totalPage: 0 };
  const tableData = customerMonitoringData?.contents?.map((item: any) => ({
    ...item,
    aging: item?.aging ?? '-',
    // dueDate: item?.dueDate ?? '-', // TODO: Check if '-' is correct for date type
    visitLocation: item?.visitLocation ?? '-',
  })) || [];

  useEffect(() => {
    setPage(1);
  }, [filter]);

  // Record activity when page loads
  useEffect(() => {
    if (customerMonitoringData && !isLoading) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        module: 'MONITORING',
        process: 'CUSTOMER_MONITORING',
        remarks: 'view customer monitoring list page',
      });
    }
  }, [customerMonitoringData, isLoading, recordActivity]);

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '1vw' },
      type: 'index',
    },
    {
      key: 'bucketMasterId',
      label: 'Master ID',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'debtorId',
      label: 'ID',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'commitment',
      label: 'Komitmen',
      sx: {
        minWidth: '15vw',
      },
    },
    {
      key: 'institutionTypeLabel',
      label: 'Tipe Institusi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'divisionLabel',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      render: (data) => (
        <TextStyle variant="body5">
          {data?.createdDate ? formatDateTime(data?.createdDate) : '-'}
        </TextStyle>),
      sx: { minWidth: '13vw' },
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sx: { minWidth: '11vw' },
      type: 'date',
    },
    {
      key: 'processLabel',
      label: 'Proses',
      sx: { minWidth: '13vw' },
      type: 'status',
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: { minWidth: '15vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (row) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: row?.bucketProcessId || '',
              module: 'MONITORING',
              process: 'CUSTOMER_MONITORING',
              remarks: `view customer monitoring detail: ${row?.debtorName || 'N/A'} (ID: ${row?.debtorId || 'N/A'})`,
            });
            NiceModal.show(modalCustomerMonitoring.DETAIL_INFORMATION_CUSTOMER, {
              rowData: row,
            });
          },
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: orderByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Created Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      allowFutureDates: true,
      endKey: 'endDueDate',
      label: 'Due Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
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
    // Hide division filter jika bukan business division
    ...(isBusinessDivision ? [{
      key: 'division',
      label: 'Divisi',
      options: divisionOptions || [],
      type: 'multiple-autocomplete',
      watch: (value: string[]) => {
        // Update real-time state saat user memilih division
        const divisionValues = Array.isArray(value)
          ? value.map(String)
          : [];
        setRealTimeDivision(divisionValues);
      },
    }] : []),
    {
      key: 'process',
      label: 'Proses',
      options: processOptions || [],
      type: 'multiple-autocomplete',
      watch: (value: string[]) => {
        // Update real-time state saat user memilih process
        // JANGAN update filter di sini, filter hanya diupdate saat Apply diklik
        const processValues = Array.isArray(value)
          ? value.map(String)
          : [];
        setRealTimeProcess(processValues);

        // Jika process dikosongkan, hapus process dan status dari appliedFilter
        // Ini untuk memastikan payload tidak mengandung process yang sudah dihapus
        if (processValues.length === 0) {
          setAppliedFilter((prev) => {
            const newFilter = { ...prev.filter };
            let hasChanges = false;

            if (prev?.filter?.process) {
              delete newFilter.process;
              hasChanges = true;
            }
            if (prev?.filter?.status) {
              delete newFilter.status;
              hasChanges = true;
            }

            return hasChanges ? { ...prev, filter: newFilter } : prev;
          });
        }
      },
    },
    {
      isDisabled: realTimeProcess.length === 0,
      key: 'status',
      label: 'Status',
      options: statusOptions || [],
      type: 'multiple-autocomplete',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    setState,
    state,
    tableData,
    tableHeader,
    tablePage,
  };
};
