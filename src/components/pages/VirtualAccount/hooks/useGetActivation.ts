import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ActivationRequest {
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
    division: Array<{}>;
    gam: Array<{}>;
    status: Array<{}>;
    statusActivation: Array<{}>;
    startDate: string;
    endDate: string;
  };
}
const useGetActivation = (
  payload: ActivationRequest,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const response = await API('master.virtualAccount.activation', { data: payload });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    queryKey: ['va-activation-list', payload],
    ...config,
  });

  return query;
};

export default useGetActivation;
