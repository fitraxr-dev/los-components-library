'use client';

import { useQuery } from '@tanstack/react-query';

import useGetDataReportLogPenomoranMemoDetail from '@/hooks/services/report/log-penomoran-memo/useGetDataReportLogPenomoranMemoDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportLogPenomoranMemoDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
