'use client';

import { useQuery } from '@tanstack/react-query';

import useGetDataReportLaporanDetailCustomerPipelineDetail from '@/hooks/services/report/laporan-detail-customer-pipeline/useGetDataReportLaporanDetailCustomerPipelineDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportLaporanDetailCustomerPipelineDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
