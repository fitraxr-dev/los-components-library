'use client';

import { useQuery } from '@tanstack/react-query';

import useGetDataReportAssessmentApuPptDetail from '@/hooks/services/report/assessment-apu-ppt/useGetDataReportAssessmentApuPptDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportAssessmentApuPptDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
