import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByBcmDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetBucketByBcm = (payload: RequestByBcmDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getBucketByBcm(payload);

      return res.data.data?.content;
    },
    queryKey: ['bcm', payload],
  });

  return query;
};

export default useGetBucketByBcm;
