'use client';

import { useQuery } from '@tanstack/react-query';

import useGetDataReportBmppGroupDpopDetail from '@/hooks/services/report/report-bmpp-group-dpop/useGetDataReportBmppGroupDpopDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportBmppGroupDpopDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
