import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface CustomerMonitoringDetailPayload {
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

interface CustomerMonitoringDetailResponse {
  contents?: any[];
  page?: {
    totalItem: number;
    totalPage: number;
  };
  data?: {
    contents?: any[];
    page?: {
      totalItem: number;
      totalPage: number;
    };
  };
}

const useGetMonitoringCustomerDetail = (
  payload: CustomerMonitoringDetailPayload,
  config?: Partial<UseQueryOptions<CustomerMonitoringDetailResponse>>
) => {
  const query = useQuery<CustomerMonitoringDetailResponse>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const requestPayload: any = {
        filter: payload?.filter ?? {},
        page: payload?.page ?? {
          itemPerPage: 10,
          noPage: 1,
        },
        searchDetail: payload?.searchDetail ?? { key: '', value: '' },
      };

      // Only include sortList if it's defined
      if (payload?.sortList !== undefined && payload?.sortList !== null) {
        requestPayload.sortList = payload.sortList;
      }

      const res = await API('bucket.customerMonitoring.detail', {
        data: requestPayload,
      });
      return res.data?.data ?? {};
    },
    queryKey: ['customer-monitoring-detail', payload],
    ...config,
  });

  return query;
};

export default useGetMonitoringCustomerDetail;
