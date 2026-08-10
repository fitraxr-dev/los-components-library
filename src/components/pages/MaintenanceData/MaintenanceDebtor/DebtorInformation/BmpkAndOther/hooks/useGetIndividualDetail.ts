import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetIndividualDetail = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    // enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.bmpp.customerIndividualResult', { data: payload });
      return res.data.data;
    },
    queryKey: ['mc-bmpp-individual-list', payload],
    ...config,
  });

  return query;
};

export default useGetIndividualDetail;
