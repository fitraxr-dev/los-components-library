import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

type Params = {
  facilityId?: string | null;
  bucketProcessId?: string | null;
};

const useGetDetailFinancingFacility = (payload: Params) => {
  const { facilityId, bucketProcessId } = payload || {};

  return useQuery({
    enabled: Boolean(facilityId && bucketProcessId),
    queryFn: async () => {
      if (!facilityId || !bucketProcessId) return null;

      const res = await api.getDetailFinancingFacility({
        bucketProcessId,
        facilityId,
      });

      return res?.data?.data?.content ?? null;
    },
    queryKey: ['financing-facility-detail', facilityId, bucketProcessId],
  });
};

export default useGetDetailFinancingFacility;
