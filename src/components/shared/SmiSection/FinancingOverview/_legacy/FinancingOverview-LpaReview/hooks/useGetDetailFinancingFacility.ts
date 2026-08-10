import { useQuery } from '@tanstack/react-query';

import useIdentity from '@/hooks/useIdentity';
import { BucketControllerApi } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetDetailFinancingFacility = () => {
  const { facilityId, bucketProcessId } = useIdentity();

  const query = useQuery({
    enabled: Boolean(facilityId && bucketProcessId),
    queryFn: async () => {
      const res = await api.getDetailFinancingFacility({
        bucketProcessId: bucketProcessId,
        facilityId: facilityId,
      });

      return res.data.data.content;
    },
    queryKey: ['financing-facility-detail', bucketProcessId, facilityId],
  });

  return query;
};

export default useGetDetailFinancingFacility;
