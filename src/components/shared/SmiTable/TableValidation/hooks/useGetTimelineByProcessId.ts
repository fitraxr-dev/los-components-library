import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { TimelineControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoRequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new TimelineControllerApi();

const useGetTimelineByProcessId = (payload: GenericBucketRequestDtoRequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getHistoryByProcessId(payload);
      return res.data;
    },
    queryKey: [
      'timeline',
      payload
    ],
    refetchOnMount: 'always',
    select: (res) => res?.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetTimelineByProcessId;
