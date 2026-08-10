import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface CustomerMonitoringPayload {
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

interface CustomerMonitoringResponse {
  contents?: any[];
  page?: {
    totalItem: number;
    totalPage: number;
  };
}

const useGetCustomerMonitoringList = (
  payload: CustomerMonitoringPayload,
  config?: Partial<UseQueryOptions<CustomerMonitoringResponse>>
) => {
  const query = useQuery<CustomerMonitoringResponse>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.customerMonitoring.list', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    queryKey: ['customer-monitoring-list', payload],
    ...config,
  });

  return query;
};

export default useGetCustomerMonitoringList;
