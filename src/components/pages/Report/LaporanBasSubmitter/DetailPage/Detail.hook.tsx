'use client';

import useGetDataReportBasAsSubmitterDetail from '@/hooks/services/report/bas-as-submitter/useGetDataReportBasAsSubmitterDetail';


const useDetail = (id: string) => {
  const { data, isLoading } = useGetDataReportBasAsSubmitterDetail(id);

  return {
    data,
    isLoading,
  };
};

export default useDetail;
