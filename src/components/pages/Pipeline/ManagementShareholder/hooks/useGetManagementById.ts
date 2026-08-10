import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { CustomerManagementControllerApi } from '@/services/openapi/bucket-service';

import type { CustomerManagementRequestDto, CustomerManagementResponseDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const master = new CustomerManagementControllerApi();

const useGetManagement = (payload: CustomerManagementRequestDto,
  config?: Partial<UseQueryOptions<CustomerManagementResponseDto>>
) => {
  const query = useQuery({

    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await master.detailCustomerManagement(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['management-detail', payload],
    ...config,
  },
  );

  return query;
};


export default useGetManagement;
