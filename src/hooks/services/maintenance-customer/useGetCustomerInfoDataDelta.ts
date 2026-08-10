import { useQuery } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { DataDeltaGetDto, DataDeltaResponseDtoObject } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MaintenanceCustomerControllerApi();

const useGetCustomerInfoDataDelta = (
  payload: DataDeltaGetDto,
  config?: Partial<UseQueryOptions<DataDeltaResponseDtoObject>>
) => {
  const query = useQuery({
    queryFn: async () => {

      const res = await api.getDataDeltaDebtorProfileInformation(payload);
      return res.data.data.content;
    },
    queryKey: ['detail-maintenance-customer-data-delta', payload],
    ...config,
  });

  return query;
};
export default useGetCustomerInfoDataDelta;
