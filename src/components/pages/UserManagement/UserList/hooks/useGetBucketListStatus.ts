import { useQuery } from '@tanstack/react-query';

import { BucketListControllerApi } from '@/services/openapi/bucket-service';

import type { UseQueryOptions } from '@tanstack/react-query';

// Generic interface for bucket list status request
interface BucketListStatusRequest {
  module: string;
  process: string;
}

const api = new BucketListControllerApi();

const useGetBucketListStatus = (
  payload: BucketListStatusRequest,
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getBucketStatusList(payload as any);

      return res.data.data.contents;
    },
    queryKey: ['bucket-list-status', payload],
  });

  return query;
};

export default useGetBucketListStatus;
