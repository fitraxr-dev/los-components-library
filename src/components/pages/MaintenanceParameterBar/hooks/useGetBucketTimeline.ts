import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getBucketTimeline } from './constant';

import type { BucketTimelineRequest, BucketTimelineResponse } from './constant';
import type { UseQueryOptions } from '@tanstack/react-query';

/**
 * Custom hook untuk fetch bucket timeline
 */
const useGetBucketTimeline = (
  payload: BucketTimelineRequest,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery<any>({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return await getBucketTimeline(payload);
    },
    queryKey: ['bucket-timeline', payload], // Default enabled
    ...config, // This will override enabled if provided
  });

  return query;
};

export default useGetBucketTimeline;
