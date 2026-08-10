import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataStaff = (payload: any, config?: Partial<UseQueryOptions<any>>) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const body = {
          role: ['STAFF'],
          value: payload?.value ?? '',
        };

        console.log('Calling API with payload:', body);
        const response = await API('userManagement.lov.staff', { data: body });
        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['staff-name', payload],
    ...config,
  });

  return query;
};

export default useGetDataStaff;
