import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByIdDtoLong } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetDetailAdditionalFacility = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetaiAdditionalFacility(payload);

      return res.data.data.content;
    },
    queryKey: ['detail-additional', payload],
  });

  return query;
};

export default useGetDetailAdditionalFacility;
