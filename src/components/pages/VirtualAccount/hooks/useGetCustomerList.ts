import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { VirtualAccountControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoVABucketListFilterDto } from '@/services/openapi/master-service';


const api = new VirtualAccountControllerApi();

const useGetCustomerList = (payload: GenericBucketRequestDtoVABucketListFilterDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getCustomerListVA(payload);

      return res.data.data;
    },
    queryKey: ['customer-va-list', payload],
  });
  return query;
};

export default useGetCustomerList;
