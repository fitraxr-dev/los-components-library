import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { FinancingFacilityResponseDto, RequestByIdDtoLong } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetFinancingFacility = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: !!payload.id,
    placeholderData: {},
    queryFn: async () => {
      const res = await api.getDetailFinancingFacility(payload);
      const result: FinancingFacilityResponseDto = res.data.data.content;

      return result;
    },
    queryKey: ['financing-facility'],
  });

  return query;
};

export default useGetFinancingFacility;
