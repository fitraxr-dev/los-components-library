'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelTatSlaDetails from '@/hooks/services/report/report-tat-sla-details/useGenerateReportExcelTatSlaDetails';
import useGenerateReportPDFTatSlaDetails from '@/hooks/services/report/report-tat-sla-details/useGenerateReportPDFTatSlaDetails';
import useGetDataReportTatSlaDetails from '@/hooks/services/report/report-tat-sla-details/useGetDataReportTatSlaDetails';
import useGetCustomerName from '@/hooks/services/report/useGetCustomerName';
import useGetStatusProcess from '@/hooks/services/report/useGetStatusProcess';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';

// format header table
type SortState = {
  sort: string;
  order: 'asc' | 'desc';
};

const makeSortableColumn = (
  key: string,
  label: string,
  minWidth: string,
  { sort, order }: SortState,
  handleSort: (field: string) => void,
  type?: TableHeader['type'],
): TableHeader => ({
  isSortable: true,
  key,
  label,
  onSort: () => handleSort(key),
  sortDirection: sort === key ? order : false,
  sx: { minWidth },
  type,
});

const useTabListData = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState(null);
  const [sort, setSort] = useState<string>('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [customerNameSearchValue, setCustomerNameSearchValue] = useState('');
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [statusProcessSearchValue, setStatusProcessSearchValue] = useState('');
  const [totalPage, setTotalPage] = useState(1);
  const { recordActivity } = useRecordLog();

  const [isReset, setIsReset] = useState(false);

  const canDownloadFile = useCheckAccess(accessid.REPORT_TAT_SLA_FIN_DETAILS_DOWNLOAD);

  const { data: divisions = [], isFetching: isLoadingDivisions } = useSearchAllDivision({
    value: divisionSearchValue,
  });
  const divisionOptions = (divisions?.contents ?? []).map((d) => ({
    label: d?.name,
    value: d?.id,
  }));

  const { data: customerNames = [], isFetching: isLoadingCustomerNames } = useGetCustomerName({
    value: customerNameSearchValue,
  });
  const customerOptions = (customerNames?.contents ?? []).map((c) => ({
    label: c?.customerName,
    value: c?.customerId,
  }));

  const { data: typeProcessDropdownList } = useGetParameterList('typeProcess');

  const { data: statusProcess = [], isFetching: isLoadingstatusProcess } = useGetStatusProcess({
    value: statusProcessSearchValue,
  });
  const statusProcessOptions = (statusProcess?.contents ?? []).map((s) => ({
    label: s?.label,
    value: s?.statusName,
  }));

  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportTatSlaDetails(
    searchParams !== null ? {
      filter: {
        createdDivision: searchParams.createdDivision ?? [],
        customerName: searchParams.customerName ?? [],
        divisionName: searchParams.divisionName ?? [],
        endDate: searchParams.endDate ?? '',
        processName: searchParams.processName ?? '',
        processStatus: searchParams.processStatus ?? [],
        processType: searchParams.processType ?? [],
        startDate: searchParams.startDate ?? '',
      },
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      searchDetail: {
        key: '',
        value: '',
      },
    } : null
  );

  const isLoading = isFetching;

  useEffect(() => {
    if (data?.page) {
      setTotalPage(data.page.totalPage > 0 ? data.page.totalPage : 1);
    }
  }, [data, searchParams]);

  useEffect(() => {
    if (isReset) {
      setTotalPage(1);
      setIsReset(false);
    }
  }, [isReset]);

  const handleSort = (key: string) => {
    if (key === sort) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(key);
      setOrder('asc');
    }
    setPage(1);
  };

  // Generate report mutations
  const { mutate: generateExcel } = useGenerateReportExcelTatSlaDetails({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh Excel, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download excel report tat sla details',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFTatSlaDetails({
    onError: () => {
      showNiceModalV2({
        title: 'Gagal mengunduh PDF, silahkan dicoba lagi',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'File is processed in background please wait!',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'generate download pdf report tat sla details',
      });
    },
  });

  const sortState = { order, sort };
  const tableHeader: TableHeader[] = [
    { key: 'index', label: 'No', sx: { minWidth: '1vw' }, type: 'index' },
    makeSortableColumn('pipelineId', 'Pipeline ID', '10vw', sortState, handleSort),
    makeSortableColumn('customerId', 'Customer ID', '10vw', sortState, handleSort),
    makeSortableColumn('applicationNo', 'Application No', '10vw', sortState, handleSort),
    makeSortableColumn('idProcess', 'ID Process', '10vw', sortState, handleSort),
    makeSortableColumn('cif', 'CIF', '10vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '10vw', sortState, handleSort),
    makeSortableColumn('customerStatus', 'Customer Status', '10vw', sortState, handleSort),
    makeSortableColumn('processType', 'Process Type', '10vw', sortState, handleSort),
    makeSortableColumn('divisionName', 'Division Name', '10vw', sortState, handleSort),
    makeSortableColumn('gamId', 'GAM', '10vw', sortState, handleSort),
    makeSortableColumn('processStatus', 'Status Process', '10vw', sortState, handleSort),
    makeSortableColumn('backAndForth', 'Ada BnF?', '10vw', sortState, handleSort),
    makeSortableColumn('documentNo', 'No. Digital Dokumen/Seq/ID', '10vw', sortState, handleSort),
    makeSortableColumn('documentName', 'Nama Dokumen/Proses', '10vw', sortState, handleSort),
    makeSortableColumn('documentDate', 'Tanggal Digital Dokumen', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('createdDivision', 'Creator Division', '10vw', sortState, handleSort),
    // makeSortableColumn('staffAssignmentDate', 'Staff Assignment Date', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('createdStartDate', 'Created Start Date', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('createdEndDate', 'Created End Date', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('reviewStartDate', 'Review Start Date', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('reviewEndDate', 'Review End Date', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('approvedStartDate', 'Approved Start Date', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('approvedEndDate', 'Approved End Date', '10vw', sortState, handleSort, 'date'),
    makeSortableColumn('totalDayGross', 'Total TAT Days Gross', '10vw', sortState, handleSort),
    makeSortableColumn('totalBackAndForth', 'TAT Days - TAT Back and Forth', '10vw', sortState, handleSort),
    makeSortableColumn('totalIdle', 'TAT Days - Waiting Time/Idle', '10vw', sortState, handleSort),
    makeSortableColumn('totalDaysNet', 'Total TAT Days Nett', '10vw', sortState, handleSort),
    makeSortableColumn('totalBnFInternal', 'Jumlah BnF internal', '10vw', sortState, handleSort),
    makeSortableColumn('totalBnFCrossDivision', 'Jumlah BnF lintas divisi', '10vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalGross', 'SLA Meet Total Gross', '10vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalNett', 'SLA Meet Total Nett', '10vw', sortState, handleSort),
  ];

  const handleClear = () => {
    setSearchParams(null);
    setPage(1);
    setTotalPage(1);
    setIsReset(true);
  };

  const handleDownloadPDF = () => {
    generatePDF(searchParams || {});
  };

  const handleDownloadExcel = () => {
    generateExcel(searchParams || {});
  };

  const handleSearch = (params: any) => {
    const startDate = params?.startDate ? formatDate(params?.startDate, 'YYYY-MM-DD') : '';
    let endDate = params?.endDate ? formatDate(params?.endDate, 'YYYY-MM-DD') : '';

    if (startDate && !endDate) {
      endDate = formatDate(new Date(), 'YYYY-MM-DD');
    }

    setSearchParams({
      ...params,
      endDate,
      startDate,
    });
    setPage(1);
    setIsReset(false);
  };

  const handleDivisionSearch = (value: string) => {
    if (value.length >= 3) {
      setDivisionSearchValue(value);
    } else {
      setDivisionSearchValue('');
    }
  };

  return {
    canDownloadFile,
    customerOptions,
    data,
    divisionOptions,
    handleClear,
    handleDownloadExcel,
    handleDownloadPDF,
    handleSearch,
    isLoading,
    isLoadingCustomerNames,
    page,
    searchParams,
    setPage,
    setPageSize,
    statusProcessOptions,
    tableHeader,
    totalPage,
    typeProcessDropdownList,
  };
};

export default useTabListData;
