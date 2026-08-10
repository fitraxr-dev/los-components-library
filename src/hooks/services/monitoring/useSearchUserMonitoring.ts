import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface SearchUserMonitoringPayload {
  division?: string;
  positionGroup?: string;
  value?: string;
}

const useSearchAllUserMonitoring = (
  payload: SearchUserMonitoringPayload,
  config?: Partial<UseQueryOptions<any>>) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('userManagement.user.lovMonitoring', { data: payload });
      return res.data.data;
    },
    queryKey: ['users', payload],
    ...config,
  });
  return query;
};

export default useSearchAllUserMonitoring;
