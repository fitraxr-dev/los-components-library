'use client';

import useGetDataReportBasAsParticipantDetail from '@/hooks/services/report/bas-as-participant/useGetDataReportBasAsParticipantDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportBasAsParticipantDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
