import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDirektorat = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  return useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,

    queryFn: async () => {
      try {
        const body = {
          filter: {
            type: 'INTERNAL',
          },
          page: {
            itemPerPage: 10000,
            noPage: 1,
          },
          searchDetail: {
            key: 'name',
            value: payload?.value ?? '',
          },
        };

        console.log('Calling API with payload:', body);

        const response = await API('userManagement.lov.direktorat', {
          data: body,
        });

        console.log('API response:', response);

        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },

    queryKey: ['direktorat-data', payload],

    ...config,
  });
};

export default useGetDirektorat;
