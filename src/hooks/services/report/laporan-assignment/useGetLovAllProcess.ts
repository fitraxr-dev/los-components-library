import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetLovAllProcess = (
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const response = await API('dashboard.inquiry.filterProcess');
        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['all-process-data'],
    ...config,
  });

  return query;
};

export default useGetLovAllProcess;
