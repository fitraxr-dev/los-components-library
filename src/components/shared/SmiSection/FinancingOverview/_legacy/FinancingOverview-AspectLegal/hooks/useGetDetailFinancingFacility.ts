import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { DetailFinancingFacilityPayload } from './useGetDetailFinancingFacility.types';


const useGetDetailFinancingFacility = (payload: DetailFinancingFacilityPayload) => {
  const query = useQuery({
    enabled:
             payload.facilityId !== null && payload.facilityId !== undefined &&
             payload.bucketProcessId !== null && payload.bucketProcessId !== undefined,
    queryFn: async () => {
      const res = await API('bucket.financialFacility.detail', {
        data: {
          bucketProcessId: payload.bucketProcessId,
          facilityId: payload.facilityId,
        },
      });

      return res.data?.data?.content ?? [];
    },
    queryKey: ['financing-facility-detail'],
  });

  return query;
};

export default useGetDetailFinancingFacility;
