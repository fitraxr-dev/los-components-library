import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetLovAllRole = (
  payload: {
    page: {
      noPage: number;
      itemPerPage: number;
    };
    sortList: {
      columnName: string;
      sortType: string;
    };
    searchDetail: {
      key: string;
      value: string;
    };
    filter: {
      group: string;
    };
  },
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const response = await API('userManagement.lov.role', { data: payload });
        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['all-role-data', payload],
    ...config,
  });

  return query;
};

export default useGetLovAllRole;
