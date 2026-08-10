'use client';

import useGetDataReportLaporanCustomerGroupDetail from '@/hooks/services/report/laporan-customer-group/useGetDataReportLaporanCustomerGroupDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportLaporanCustomerGroupDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
