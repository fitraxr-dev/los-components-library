import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetGroupList = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling Group List API with payload:', payload);
        const response = await API('report.bmppGroup.search', { data: payload });
        console.log('Group List API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('Group List API error:', error);
        throw error;
      }
    },
    queryKey: ['report-bmpp-group-list', payload],
    ...config,
  });

  return query;
};

export default useGetGroupList;
