import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoRequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetFinancingFacilityAllExisting = (payload: GenericBucketRequestDtoRequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListFinanceFacilityByBucketProcessId(payload);
      const result = res.data.data;

      return result;
    },
    queryKey: ['financing-facility-all-existing', { ...payload }],
  });

  return query;
};

export default useGetFinancingFacilityAllExisting;
