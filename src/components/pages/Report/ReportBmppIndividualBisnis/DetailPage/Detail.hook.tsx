'use client';

import { useQuery } from '@tanstack/react-query';

import useGetDataReportBmppIndividualBisnisDetail from '@/hooks/services/report/report-bmpp-individual-bisnis/useGetDataReportBmppIndividualBisnisDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportBmppIndividualBisnisDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
