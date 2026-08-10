'use client';

import { useEffect, useState, useMemo } from 'react';

import { Chip } from '@mui/material';
import dayjs from 'dayjs';

import useGetDataProgressOverviewList from '@/hooks/services/overview/progress-rate/useGetDataProgressOverviewList';
import useGetDataProgressOverviewStatus from '@/hooks/services/overview/progress-rate/useGetDataProgressOverviewStatus';
import useGetProcessNonBusiness from '@/hooks/services/overview/success-rate/useGetProcessNonBusiness';

import useGetAllProcess from '@/components/pages/DashboardPage/hooks/useGetAllProces';

import type { ProcessDetailItem, ProgressRateFilterValue, UseProgressRateProps } from './ProgressRate.types';


const chipStyle = {
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: 500,
  px: 1,
};

export default function useProgressRate() {
  const [filter, setFilter] = useState<ProgressRateFilterValue>({
    filter: {
      debtorId: [],
      divisionId: [],
      endAging: '',
      periode: dayjs().format('MM/YYYY'),
      process: [],
      staffId: [],
      startAging: '',
      status: [],
      tlId: [],
    },
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCardProcess, setSelectedCardProcess] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<'card' | 'filter'>('card');

  const f = filter.filter;
  // const { data: bucketProcessList } = useGetAllProcess();
  const { data: bucketProcessList } = useGetProcessNonBusiness('progress-rate');
  const processMap = useMemo(() => {
    if (!bucketProcessList?.contents) return {};

    const map: Record<string, string> = {};
    bucketProcessList.contents.forEach((item: any) => {
      map[item.label] = item.process;
      map[item.process] = item.process;
    });
    return map;
  }, [bucketProcessList]);

  const sortList = filter.sortList;

  const commonFilter = useMemo(() => {
    const periodeRaw = f?.periode;

    const periodeFinal = (() => {
      if (!periodeRaw) return dayjs().format('MM/YYYY');

      const parsed = dayjs(periodeRaw, ['MM/YYYY', 'YYYY-MM'], true);
      return parsed.isValid()
        ? parsed.format('MM/YYYY')
        : dayjs().format('MM/YYYY');
    })();

    return {
      debtorId: Array.isArray(f?.debtorId) ? f.debtorId : f?.debtorId ? [f.debtorId] : [],
      divisionId: Array.isArray(f?.divisionId) ? f.divisionId : f?.divisionId ? [f.divisionId] : [],
      endAging: f?.endAging || '',
      periode: periodeFinal,
      process: Array.isArray(f?.process) ? f.process : f?.process ? [f.process] : [],
      staffId: Array.isArray(f?.staffId) ? f.staffId : f?.staffId ? [f.staffId] : [],
      startAging: f?.startAging || '',
      status: Array.isArray(f?.status) ? f.status : f?.status ? [f.status] : [],
      tlId: Array.isArray(f?.tlId) ? f.tlId : f?.tlId ? [f.tlId] : [],
    };
  }, [f]);

  const payload = useMemo(() => {
    return {
      filter: commonFilter,
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      searchDetail: {
        key: '',
        value: '',
      },
      ...(sortList?.columnName ? { sortList } : {}),
    };
  }, [commonFilter, page, pageSize, sortList]);

  const statusPayload = useMemo(() => {
    return {
      filter: commonFilter,
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      searchDetail: {
        key: '',
        value: '',
      },
      ...(sortList?.columnName ? { sortList } : {}),
    };
  }, [commonFilter, page, pageSize, sortList]);

  const {
    data: overviewListData,
    isLoading: loadingList,
  } = useGetDataProgressOverviewList(payload);

  const {
    data: overviewStatusData,
    isLoading: loadingStatus,
  } = useGetDataProgressOverviewStatus(statusPayload);

  const loading = loadingList || loadingStatus;

  const baseTableHeader = [
    { key: 'no', label: 'No.', type: 'index', width: '5%' },
    { key: 'customerName', label: 'Nama Customer', width: '19%' },
    { key: 'staffName', label: 'Nama User', width: '19%' },
    { key: 'process', label: 'Process', width: '19%' },
    { align: 'center', key: 'status', label: 'Status', width: '19%' },
    { align: 'right', key: 'aging', label: 'Aging', width: '19%' },
  ];

  const tableHeader = useMemo(() => {
    return baseTableHeader.map((header) => {
      if (header.key === 'quantity' || header.key === 'count' || header.key === 'totalItems' || header.key === 'aging') {
        return {
          ...header,
          preserveZero: true,
        };
      }
      return header;
    });
  }, []);

  const getStatusChipColor = (status: string) => {
    if (/REJECT|CANCELED|FAILED/i.test(status)) {
      return 'error';
    }
    return 'primary';
  };

  const overviewList = useMemo(() => {
    if (!overviewListData?.contents) return [];

    return overviewListData.contents.map((item: ProcessDetailItem) => ({
      ...item,
      status: (
        <Chip
          label={item.status}
          size="small"
          variant="outlined"
          color={getStatusChipColor(item.status)}
          sx={chipStyle}
        />
      ),
    }));
  }, [overviewListData]);

  const totalPage = overviewListData?.page?.totalPage || 1;

  const overviewStatus = useMemo(() => {
    if (!overviewStatusData?.contents) return [];

    const selectedProcesses = Array.isArray(f?.process) ? f.process : [];

    return overviewStatusData.contents.map((item: any) => {
      const processId = processMap[item.name] || item.name;

      return {
        isSelected: selectedCardProcess === processId || selectedProcesses.includes(processId),
        name: item.name,
        processId: processId,
        value: Number(item.value),
      };
    });
  }, [overviewStatusData, processMap, selectedCardProcess, f?.process]);

  const handleStatusCardClick = (processId: string) => {
    setPage(1);
    setSelectedCardProcess(processId);
    setFilterSource('card');
    setFilter((prevFilter) => ({
      ...prevFilter,
      filter: {
        ...prevFilter.filter,
        process: [processId],
      },
    }));
  };

  const handleClearCardSelection = () => {
    setPage(1);
    setSelectedCardProcess(null);
    setFilterSource('card');
    setFilter((prevFilter) => ({
      ...prevFilter,
      filter: {
        ...prevFilter.filter,
        debtorId: [],
        divisionId: [],
        endAging: '',
        process: [],
        staffId: [],
        startAging: '',
        status: [],
        tlId: [],

      },
    }));
  };

  const handleFilterChange = (newFilter: any) => {
    setPage(1);
    setSelectedCardProcess(null);
    setFilterSource('filter');
    setFilter(newFilter);
  };

  return {
    additionalData: overviewListData?.additionalData || '',
    currentPage: page,
    filter,
    filterSource,
    handleClearCardSelection,
    handleFilterChange,
    handleStatusCardClick,
    hasProcessFilter: f?.process && f.process.length > 0,
    loading,
    overviewList,
    overviewStatus,
    selectedCardProcess,
    setFilter: handleFilterChange,
    setPage,
    setPageSize,
    tableData: overviewList,
    tableHeader,
    totalPage,
  };
}
