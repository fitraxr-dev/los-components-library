import { useQuery } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { DebtorIdentityResponseDto, DetailCustomerRequestDto } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MaintenanceCustomerControllerApi();

const useGetDetailDebtorIdentity = (
  payload: DetailCustomerRequestDto,
  config?: Partial<UseQueryOptions<DebtorIdentityResponseDto>>

) => {
  const res = useQuery({
    initialData: null,
    queryFn: async () => {
      const res = await api.getDetailCustomerMaintenanceDebtorIdentity(payload);

      return res.data.data.content;
    },
    queryKey: ['detail-maintenance-customer', payload],
    ...config,
  });

  return res;
};

export default useGetDetailDebtorIdentity;
