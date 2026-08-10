import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataReportBmppGroupDetailProposed = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const response = await API('report.bmppGroup.detailProposed', { data: payload });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    queryKey: ['report-bmpp-group-detail-proposed', payload],
    ...config,
  });

  return query;
};

export default useGetDataReportBmppGroupDetailProposed;
