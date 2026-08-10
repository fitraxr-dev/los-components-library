import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { FinancingFacilityResponseDto, FinancingFacilityRequestDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetFinancingFacility = (payload: FinancingFacilityRequestDto) => {

  const query = useQuery({
    enabled: !!payload.facilityId,
    placeholderData: payload.facilityId ? {} : undefined,
    queryFn: async () => {
      const res = await api.getDetailFinancingFacility(payload);
      const result: FinancingFacilityResponseDto = res.data.data.content;

      const rootKeys = new Set(Object.keys(result));

      const flattenedAttributes = result?.attributes?.reduce((acc, { attributeKey, attributeValue }) => {
        if (!rootKeys.has(attributeKey)) {
          acc[attributeKey] = attributeValue;
        }
        return acc;
      }, {} as Record<string, any>) || {};

      const newResult = Object.assign({}, result, flattenedAttributes);

      return newResult;
    },
    queryKey: ['financing-facility', payload.facilityId],
  });

  return query;
};

export default useGetFinancingFacility;
