import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataReportBmppGroupDpopDetailExisting = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await API('report.bmppGroupDpop.detailExisting', { data: payload });
      return response.data.data;
    },
    queryKey: ['report-bmpp-group-dpop-detail-existing', payload],
    ...config,
  });

  return query;
};

export default useGetDataReportBmppGroupDpopDetailExisting;
