import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { FinancingFacilityRequestDto } from '@/services/openapi/bucket-service/api';


const useGetDetailFinancingFacility = (payload: FinancingFacilityRequestDto) => {
  const query = useQuery({
    enabled: !!payload?.facilityId && !!payload?.bucketProcessId,
    queryFn: async () => {
      const res = await API('bucket.financialFacility.detail', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['financing-facility-detail', payload?.facilityId, payload?.bucketProcessId],
  });

  return query;
};

export default useGetDetailFinancingFacility;
