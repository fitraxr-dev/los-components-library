'use client';

import { useQuery } from '@tanstack/react-query';

import useGetDataReportLaporanCustomerVirtualAccountDetail from '@/hooks/services/report/laporan-customer-virtual-account/useGetDataReportLaporanCustomerVirtualAccountDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportLaporanCustomerVirtualAccountDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
