'use client';

import useGetDataReportLaporanDetailCustomerDetail from '@/hooks/services/report/laporan-detail-customer/useGetDataReportLaporanDetailCustomerDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportLaporanDetailCustomerDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
