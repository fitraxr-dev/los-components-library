import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { CustomerShareholderControllerApi } from '@/services/openapi/bucket-service';

import type { CustomerShareholderRequestDto, CustomerShareholderResponseDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const master = new CustomerShareholderControllerApi();

const useGetShareholderById = (payload: CustomerShareholderRequestDto,
  config?: Partial<UseQueryOptions<CustomerShareholderResponseDto>>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await master.detailCustomerShareholder(payload);

      return res.data.data.content;
    },
    queryKey: ['shareholder-detail', payload],
    ...config,
  });

  return query;
};


export default useGetShareholderById;
