'use client';

import { useState, useEffect } from 'react';

import { FIVE_SECONDS } from '@/configs/constants';
import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useDownloadReportLaporanCustomerLPA from '@/hooks/services/report/laporan-detail-customer-lpa/useDownloadReportLaporanCustomerLPA';
import useGenerateHistoryLaporanCustomerLPA from '@/hooks/services/report/laporan-detail-customer-lpa/useGenerateHistoryLaporanCustomerLPA';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


function getFileType(fileName) {
  if (!fileName || typeof fileName !== 'string') return 'csv';

  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : 'csv';
}

const useTabHistoryDownload = () => {
  // record log activity
  const { recordActivity } = useRecordLog();

  // user access
  const canDownloadFile = useCheckAccess(accessid.REPORT_DETAIL_CUSTOMER_LPA_DOWNLOAD);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<string>('downloadedDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // Get report history data
  const { data, isLoading, refetch } = useGenerateHistoryLaporanCustomerLPA({
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    sortList: {
      columnName: sort,
      sortType: order,
    },
  }, {
    refetchInterval: (query: any) => {
      const contents = query.state.data?.contents;
      const hasActiveProcess = contents?.some((item: any) => {
        const status = item.progressStatus?.toLowerCase();
        return status === 'on progress';
      });
      return hasActiveProcess ? FIVE_SECONDS : false;
    },
  });

  const handleSort = (key: string) => {
    if (key === sort) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(key);
      setOrder('asc');
    }
    setPage(1);
  };

  // Download report mutation
  const { mutate: downloadReport, isPending: isDownloading } = useDownloadReportLaporanCustomerLPA({
    onError: (error) => {
      console.error('Download failed:', error);
      showNiceModalV2({
        title: 'Gagal mengunduh laporan. Silakan coba lagi.',
        type: 'error',
      });
    },
    onSuccess: (response, id) => {
      console.log('Download successful:', response);
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        remarks: 'download file report detail customer LPA',
      });

      // Find the report data to get filename
      const reportData = data?.contents?.find((item: any) => item.id === id);
      const fileName = reportData?.reportName + '.' + (getFileType(reportData?.reportFileName)) || `report-${id}.csv`;

      // Handle blob download
      try {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'] || 'application/octet-stream',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showNiceModalV2({
          title: 'Laporan berhasil diunduh',
          type: 'success',
        });
      } catch (error) {
        console.error('Error creating download link:', error);
        showNiceModalV2({
          title: 'Gagal mengunduh laporan. Silakan coba lagi.',
          type: 'error',
        });
      }
    },
  });

  // Refetch data when tab is clicked
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDownload = (id: number) => {
    downloadReport(id);
  };

  const getActionOptions = (row: any) => {
    const { id, progressStatus } = row;
    const status = progressStatus?.toLowerCase();

    if (!canDownloadFile) {
      return [];
    }

    switch (status) {
      case 'success':
        return [
          {
            apiDownload: 'report.customerLPA.download',
            iconName: 'download',
            isDisabled: isDownloading || !canDownloadFile,
            isLoading: isDownloading,
            // onClick: () => handleDownload(id),
          },
        ];

      case 'failed':
        return [
          {
            iconName: 'download',
            isDisabled: true,
            onClick: () => { },
            sx: {
              opacity: 0.6,
              path: { stroke: '#FF0000' },
            },
          },
        ];

      case 'on progress':
      case 'in progress':
        return [
          {
            iconName: 'sync',
            isDisabled: true,
            onClick: () => { },
          },
        ];

      default:
        return [
          {
            iconName: 'error',
            isDisabled: true,
            onClick: () => { },
          },
        ];
    }
  };

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '1vw' },
      type: 'index',
    },
    {
      isSortable: true,
      key: 'reportName',
      label: 'Report Name',
      onSort: () => handleSort('reportName'),
      sortDirection: sort === 'reportName' ? order : false,
      sx: { minWidth: '15vw' },
    },
    {
      isSortable: true,
      key: 'reportPeriod',
      label: 'Periode Report',
      onSort: () => handleSort('reportPeriod'),
      sortDirection: sort === 'reportPeriod' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'progressStatus',
      label: 'Progress Status',
      onSort: () => handleSort('progressStatus'),
      sortDirection: sort === 'progressStatus' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'downloadedBy',
      label: 'Downloaded By',
      onSort: () => handleSort('downloadedBy'),
      sortDirection: sort === 'downloadedBy' ? order : false,
      sx: { minWidth: '10vw' },
    },
    {
      isSortable: true,
      key: 'downloadedDate',
      label: 'Downloaded Date',
      onSort: () => handleSort('downloadedDate'),
      sortDirection: sort === 'downloadedDate' ? order : false,
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: getActionOptions,
      sx: { minWidth: '8vw' },
      type: 'action',
    },
  ];

  return {
    data,
    handleDownload,
    isDownloading,
    isLoading,
    page,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useTabHistoryDownload;
