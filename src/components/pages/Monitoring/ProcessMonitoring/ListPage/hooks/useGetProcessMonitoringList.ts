import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface ProcessMonitoringPayload {
  filter?: Record<string, any>;
  page?: {
    itemPerPage: number;
    noPage: number;
  };
  searchDetail?: {
    key: string;
    value: string;
  };
  sortList?: any;
}

interface ProcessMonitoringResponse {
  contents?: any[];
  page?: {
    totalItem: number;
    totalPage: number;
  };
}

const useGetProcessMonitoringList = (
  payload: ProcessMonitoringPayload,
  config?: Partial<UseQueryOptions<ProcessMonitoringResponse>>
) => {
  // Serialize payload untuk query key yang stabil
  // Menggunakan JSON.stringify untuk memastikan query key konsisten meskipun object reference berbeda
  const queryKey = [
    'process-monitoring-list',
    payload.filter,
    payload.page,
    payload.searchDetail,
    payload.sortList,
  ];

  const query = useQuery<ProcessMonitoringResponse>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.processMonitoring.list', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    queryKey,
    ...config,
  });

  return query;
};

export default useGetProcessMonitoringList;
