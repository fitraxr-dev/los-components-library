'use client';

import { useState } from 'react';

import { formatDate } from '@/helpers/date';
import useDownloadReportBmppIndividualDpop from '@/hooks/services/report/bmpp-individual-dpop/useDownloadReportBmppIndividualDpop';
import useGenerateReportCSVBmppIndividualDpop from '@/hooks/services/report/bmpp-individual-dpop/useGenerateReportCSVBmppIndividualDpop';
import useGenerateReportExcelBmppIndividualDpop from '@/hooks/services/report/bmpp-individual-dpop/useGenerateReportExcelBmppIndividualDpop';
import useGetDataReportBmppIndividualDpop from '@/hooks/services/report/bmpp-individual-dpop/useGetDataReportBmppIndividualDpop';
import useGetHistoryReportBmppIndividualDpop from '@/hooks/services/report/bmpp-individual-dpop/useGetHistoryReportBmppIndividualDpop';


const useList = () => {
  const [activeTab, setActiveTab] = useState('list-data');
  const [searchPayload, setSearchPayload] = useState<any>(null);
  const [historyPayload, setHistoryPayload] = useState<any>(null);

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
  };

  const handleSearch = (payload: any) => {
    setSearchPayload({
      ...payload,
      endDate: payload?.endDate ? formatDate(payload?.endDate, 'YYYY-MM-DD') : '',
      startDate: payload?.startDate ? formatDate(payload?.startDate, 'YYYY-MM-DD') : '',
    });
  };

  const handleHistorySearch = (payload: any) => {
    setHistoryPayload({
      ...payload,
      endDate: payload?.endDate ? formatDate(payload?.endDate, 'YYYY-MM-DD') : '',
      startDate: payload?.startDate ? formatDate(payload?.startDate, 'YYYY-MM-DD') : '',
    });
  };

  // Data queries
  const { data: reportData, isLoading: isLoadingData } = useGetDataReportBmppIndividualDpop(searchPayload);
  const { data: historyData, isLoading: isLoadingHistory } = useGetHistoryReportBmppIndividualDpop(historyPayload);

  // Mutations
  const generateExcelMutation = useGenerateReportExcelBmppIndividualDpop();
  const generateCSVMutation = useGenerateReportCSVBmppIndividualDpop();
  const downloadMutation = useDownloadReportBmppIndividualDpop();

  const handleGenerateExcel = (payload: any) => {
    generateExcelMutation.mutate(payload);
  };

  const handleGenerateCSV = (payload: any) => {
    generateCSVMutation.mutate(payload);
  };

  const handleDownload = (id: number) => {
    downloadMutation.mutate(id);
  };

  return {
    activeTab,
    downloadMutation,
    generateCSVMutation,
    generateExcelMutation,
    handleChangeTab,
    handleDownload,
    handleGenerateCSV,
    handleGenerateExcel,
    handleHistorySearch,
    handleSearch,
    historyData,
    isLoadingData,
    isLoadingHistory,
    reportData,
  };
};

export default useList;
