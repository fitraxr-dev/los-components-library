import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoRequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetFinancingFacilityByPipelineId = (payload: GenericBucketRequestDtoRequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: !!payload.filter?.bucketProcessId,
    queryFn: async () => {
      const res = await api.getListFinanceFacilityByBucketProcessId(payload);
      const result = res.data.data;

      return result;
    },
    queryKey: ['financing-facilities', {
      page: payload.page,
    }],
  });

  return query;
};

export default useGetFinancingFacilityByPipelineId;
