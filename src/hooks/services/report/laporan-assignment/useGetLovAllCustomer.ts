import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetLovAllCustomer = (
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const response = await API('master.customerName.list', {
          data: {},
        });
        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['all-customer-data'],
    ...config,
  });

  return query;
};

export default useGetLovAllCustomer;
