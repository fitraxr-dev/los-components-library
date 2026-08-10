import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDivision = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  return useQuery({
    enabled: !!payload?.directorate,
    placeholderData: keepPreviousData,

    queryFn: async () => {
      const body = {
        filter: {
          directorate: payload.directorate,
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

      const response = await API('userManagement.lov.division', {
        data: body,
      });

      return response.data.data;
    },

    queryKey: ['division-data', payload],
    ...config,
  });
};

export default useGetDivision;
