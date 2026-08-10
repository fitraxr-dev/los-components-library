'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGenerateReportExcelTatSlaSum from '@/hooks/services/report/report-tat-sla-sum/useGenerateReportExcelTatSlaSum';
import useGenerateReportPDFTatSlaSum from '@/hooks/services/report/report-tat-sla-sum/useGenerateReportPDFTatSlaSum';
import useGetDataReportTatSlaSum from '@/hooks/services/report/report-tat-sla-sum/useGetDataReportTatSlaSum';
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

  const canDownloadFile = useCheckAccess(accessid.REPORT_TAT_SLA_FIN_SUMMARY_DOWNLOAD);

  // Division
  const { data: divisions = [], isFetching: isLoadingDivisions } = useSearchAllDivision({
    value: divisionSearchValue,
  });
  const divisionOptions = (divisions?.contents ?? []).map((d) => ({
    label: d?.name,
    value: d?.id,
  }));

  // Customer name
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

  // Get report data
  const { data, isLoading: isLoadingQuery, isFetching, error } = useGetDataReportTatSlaSum(
    searchParams !== null ? {
      filter: {
        customerName: searchParams.customerName ?? [],
        divisionName: searchParams.divisionName ?? [],
        endDate: searchParams.endDate ?? '',
        processType: searchParams.processType ?? [],
        startDate: searchParams.startDate ?? '',
        statusProcess: searchParams.statusProcess ?? [],
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
  const { mutate: generateExcel } = useGenerateReportExcelTatSlaSum({
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
        remarks: 'generate download excel report tat-sla-sum',
      });
    },
  });

  const { mutate: generatePDF } = useGenerateReportPDFTatSlaSum({
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
        remarks: 'generate download pdf report tat-sla-sum',
      });
    },
  });

  const sortState = { order, sort };
  const tableHeader: TableHeader[] = [
    { key: 'index', label: 'No', sx: { minWidth: '1vw' }, type: 'index' },
    makeSortableColumn('pipelineId', 'ID Pipeline', '10vw', sortState, handleSort),
    makeSortableColumn('customerId', 'Customer ID', '10vw', sortState, handleSort),
    makeSortableColumn('applicationNo', 'Application Number', '10vw', sortState, handleSort),
    makeSortableColumn('idProcess', 'ID Process', '10vw', sortState, handleSort),
    makeSortableColumn('pkId', 'PK ID', '10vw', sortState, handleSort),
    makeSortableColumn('cif', 'CIF', '10vw', sortState, handleSort),
    makeSortableColumn('customerName', 'Customer Name', '10vw', sortState, handleSort),
    makeSortableColumn('customerStatus', 'Customer Status', '10vw', sortState, handleSort),
    makeSortableColumn('processType', 'Process Type', '10vw', sortState, handleSort),
    makeSortableColumn('divisionName', 'Division Name', '10vw', sortState, handleSort),
    makeSortableColumn('gam', 'GAM', '10vw', sortState, handleSort),
    makeSortableColumn('statusProcess', 'Status Process', '10vw', sortState, handleSort),
    makeSortableColumn('adaBnf', 'Ada BnF?', '10vw', sortState, handleSort),
    makeSortableColumn('startDatePipeline', 'Tanggal Pipeline', '12vw', sortState, handleSort, 'date'),
    makeSortableColumn('startDateProposal', 'Tanggal Proposal', '12vw', sortState, handleSort, 'date'),
    makeSortableColumn('startDateKp', 'Tanggal KP', '12vw', sortState, handleSort, 'date'),
    makeSortableColumn('startDateEfektif', 'Tanggal Efektif', '12vw', sortState, handleSort, 'date'),
    makeSortableColumn('endDate', 'Tanggal End', '12vw', sortState, handleSort, 'date'),
    makeSortableColumn('totalTatDaysGrossPipelineToEnd', 'Total TAT Days Gross (Pipeline - End)', '15vw', sortState, handleSort),
    makeSortableColumn('totalTatDaysNettPipelineToEnd', 'Total TAT Days Nett (Pipeline - End)', '12vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalGrossPipelineToEnd', 'SLA Meet Total Gross (Pipeline - End)', '15vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalNettPipelineToEnd', 'SLA Meet Total Nett (Pipeline - End)', '12vw', sortState, handleSort),
    makeSortableColumn('totalTatDaysGrossProposalToEnd', 'Total TAT Days Gross (Proposal - End)', '15vw', sortState, handleSort),
    makeSortableColumn('totalTatDaysNettProposalToEnd', 'Total TAT Days Nett (Proposal - End)', '12vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalGrossProposalToEnd', 'SLA Meet Total Gross (Proposal - End)', '15vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalNettProposalToEnd', 'SLA Meet Total Nett (Proposal - End)', '12vw', sortState, handleSort),
    makeSortableColumn('totalTatDaysGrossPipelineToKp', 'Total TAT Days Gross (Pipeline - KP)', '15vw', sortState, handleSort),
    makeSortableColumn('totalTatDaysNettPipelineToKp', 'Total TAT Days Nett (Pipeline - KP)', '12vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalGrossPipelineToKp', 'SLA Meet Total Gross (Pipeline - KP)', '15vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalNettPipelineToKp', 'SLA Meet Total Nett (Pipeline - KP)', '12vw', sortState, handleSort),
    makeSortableColumn('totalTatDaysGrossProposalToKp', 'Total TAT Days Gross (Proposal - KP)', '15vw', sortState, handleSort),
    makeSortableColumn('totalTatDaysNettProposalToKp', 'Total TAT Days Nett (Proposal - KP)', '12vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalGrossProposalToKp', 'SLA Meet Total Gross (Proposal - KP)', '15vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalNettProposalToKp', 'SLA Meet Total Nett (Proposal - KP)', '12vw', sortState, handleSort),
    makeSortableColumn('totalTatDaysGrossPipelineToEfektif', 'Total TAT Days Gross (Pipeline - Efektif)', '15vw', sortState, handleSort),
    makeSortableColumn('totalTatDaysNettPipelineToEfektif', 'Total TAT Days Nett (Pipeline - Efektif)', '12vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalGrossPipelineToEfektif', 'SLA Meet Total Gross (Pipeline - Efektif)', '15vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalNettPipelineToEfektif', 'SLA Meet Total Nett (Pipeline - Efektif)', '12vw', sortState, handleSort),
    makeSortableColumn('totalTatDaysGrossProposalToEfektif', 'Total TAT Days Gross (Proposal - Efektif)', '15vw', sortState, handleSort),
    makeSortableColumn('totalTatDaysNettProposalToEfektif', 'Total TAT Days Nett (Proposal - Efektif)', '12vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalGrossProposalToEfektif', 'SLA Meet Total Gross (Proposal - Efektif)', '15vw', sortState, handleSort),
    makeSortableColumn('slaMeetTotalNettProposalToEfektif', 'SLA Meet Total Nett (Proposal - Efektif)', '12vw', sortState, handleSort),
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
    handleDivisionSearch,
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
