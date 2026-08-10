'use client';

import { useQuery } from '@tanstack/react-query';

import useGetDataReportBmppGroupDetail from '@/hooks/services/report/report-bmpp-group/useGetDataReportBmppGroupDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportBmppGroupDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
