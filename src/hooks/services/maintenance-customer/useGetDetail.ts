import { useQuery } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { DetailCustomerRequestDto, DetailCustomerResponseDto } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MaintenanceCustomerControllerApi();

type ResponseDetailMaintenanceCustomer = DetailCustomerResponseDto & {
  goPublic: boolean;
}

const useGetDetalMaintenanceCustomer = (
  payload: DetailCustomerRequestDto,
  config?: Partial<UseQueryOptions<ResponseDetailMaintenanceCustomer>>
) => {
  const res = useQuery({
    queryFn: async () => {
      const res = await api.getDetailCustomerMaintenance(payload);

      return { ...res.data.data.content, goPublic: res.data.data.content.goPublic || false };
    },
    queryKey: ['detail-maintenance-customer', payload],
    ...config,
  });

  return res;
};

export default useGetDetalMaintenanceCustomer;
