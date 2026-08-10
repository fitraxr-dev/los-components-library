import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetTotalExposureDebtor = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getExposureBucket(payload);

      return res.data?.data?.content || {};
    },
    queryKey: ['total-exposure-debtor', payload],
  });
  return query;
};

export default useGetTotalExposureDebtor;
