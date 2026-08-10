import { useQuery } from '@tanstack/react-query';

import { CustomerManagementControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoCustomerManagementRequestDto } from '@/services/openapi/bucket-service';


const api = new CustomerManagementControllerApi();

const useGetManagementList = (payload: GenericBucketRequestDtoCustomerManagementRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.listCustomerManagement(payload);
      const managementData = res.data.data;

      return managementData;
    },
    queryKey: ['management-list', payload],
  });

  return query;
};

export default useGetManagementList;
