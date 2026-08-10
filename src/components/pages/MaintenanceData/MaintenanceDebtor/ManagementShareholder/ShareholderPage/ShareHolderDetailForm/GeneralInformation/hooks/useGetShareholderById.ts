import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceShareholderControllerApi } from '@/services/openapi/master-service';

import type { DetailShareholderRequestDto, DetailShareholderResponseDto } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const master = new MaintenanceShareholderControllerApi();

const useGetShareholderById = (
  payload: DetailShareholderRequestDto,
  config?: Partial<UseQueryOptions<DetailShareholderResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await master.getDetailCustomerMaintenanceShareholder(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['shareholder-detail-by-id', payload],
    ...config,
  });

  return query;
};


export default useGetShareholderById;
