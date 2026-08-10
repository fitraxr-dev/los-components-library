import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByIdDtoLong } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetDetailFinancingFacility = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: payload.id !== null && payload.id !== undefined,
    queryFn: async () => {
      const res = await api.getDetailFinancingFacility(payload);

      return res.data.data.content;
    },
    queryKey: ['financing-facility-detail'],
  });

  return query;
};

export default useGetDetailFinancingFacility;
