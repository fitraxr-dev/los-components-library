import { useQuery } from '@tanstack/react-query';


import { MaintenanceManagementControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoListMManagementRequestDto } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MaintenanceManagementControllerApi();

const useGetManagementList = (
  payload: GenericBucketRequestDtoListMManagementRequestDto,
  config?: Partial<UseQueryOptions<GenericBucketRequestDtoListMManagementRequestDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getCustomerMaintenanceManagement(payload);
      const managementData = res.data.data;

      return managementData;
    },
    queryKey: ['management-list', payload],
    ...config,
  });

  return query;
};

export default useGetManagementList;
