'use client';

import useGetDataReportLaporanDetailCustomerSiteVisitDetail from '@/hooks/services/report/laporan-detail-customer-site-visit/useGetDataReportLaporanDetailCustomerSiteVisitDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportLaporanDetailCustomerSiteVisitDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
