import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface CustomerNameRequest {
  value: string;
}

export interface CustomerNameDetail {
  customerId: string;
  customerName: string;
}

const useGetAllCustomerName = (
  payload: CustomerNameRequest,
  config?: Partial<UseQueryOptions<{ label: string; value: string }[]>>
) => {
  const query = useQuery<{ label: string; value: string }[]>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.lov.customerName', { data: payload });
      const result: CustomerNameDetail[] = res.data.data.contents;

      return result.map((data) => ({
        id: data.customerId,
        key: data.customerId,
        label: data.customerName,
        value: data.customerId,
      }));
    },
    queryKey: ['customer-name', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};


export default useGetAllCustomerName;
