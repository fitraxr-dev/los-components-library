import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface BucketTimelineRequest {
  filter: {
    bucketProcessId: string;
    module: string;
    process: string;
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
}

interface BucketTimelineResponse {
  data: {
    contents: Array<{
      processId: string;
      division: string;
      statusLabel: string;
      comment: string;
      createdBy: string;
      createdDate: string;
    }>;
    page: {
      totalPage: number;
      totalItem: number;
      currentPage: number;
    };
  };
}

const fetchBucketTimeline = async (request: BucketTimelineRequest): Promise<BucketTimelineResponse> => {
  const response = await API('parameter.paramVa.validationList', { data: request });
  return response.data;
};

export const useGetBucketTimeline = (
  request: BucketTimelineRequest,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    enabled: options?.enabled ?? true,
    queryFn: () => fetchBucketTimeline(request),
    queryKey: ['bucket-timeline', request],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
