import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { FulfillmentLoanRequirementControllerApi } from '@/services/openapi/mip-service';

import type { GenericBucketRequestDtoRequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new FulfillmentLoanRequirementControllerApi();

const useGetFullfillmentList = (payload: GenericBucketRequestDtoRequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListFulfillmentLoanRequirement(payload);

      return res?.data?.data;
    },
    queryKey: ['mup-fulfillment-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetFullfillmentList;
