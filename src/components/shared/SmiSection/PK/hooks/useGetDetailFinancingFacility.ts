import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { FinancingFacilityRequestDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetDetailFinancingFacility = (payload: FinancingFacilityRequestDto) => {
  const query = useQuery({
    enabled: (payload.facilityId !== null && payload.facilityId !== undefined &&
              payload.bucketProcessId !== null && payload.bucketProcessId !== undefined) ||
             (payload.id !== null && payload.id !== undefined),
    queryFn: async () => {
      const res = await api.getDetailFinancingFacility(payload);
      return res.data.data.content;
    },
    queryKey: ['financing-facility-detail', payload.facilityId, payload.bucketProcessId, payload.id],
  });

  return query;
};

export default useGetDetailFinancingFacility;
