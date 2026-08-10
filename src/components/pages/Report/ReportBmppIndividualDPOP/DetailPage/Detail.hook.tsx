'use client';

import { useQuery } from '@tanstack/react-query';

import useGetDataReportBmppIndividualDpopDetail from '@/hooks/services/report/bmpp-individual-dpop/useGetDataReportBmppIndividualDpopDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportBmppIndividualDpopDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
