import { useQuery } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { DetailCustomerRequestDto, GeneralInformationResponseDto } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MaintenanceCustomerControllerApi();

type ResponseDetailGeneralInfo = GeneralInformationResponseDto & {
  goPublic: boolean;
}

const useGetDetailGeneralInformation = (
  payload: DetailCustomerRequestDto,
  config?: Partial<UseQueryOptions<ResponseDetailGeneralInfo>>

) => {
  const res = useQuery({
    initialData: null,
    queryFn: async () => {
      const res = await api.getDetailCustomerMaintenance(payload);

      return res.data.data.content;
    },
    queryKey: ['detail-maintenance-customer-general-info', payload],
    ...config,
  });

  return res;
};

export default useGetDetailGeneralInformation;
