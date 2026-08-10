import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BarControllerApi } from '@/services/openapi/master-service';

import type { BarDiscussionFollowUpResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BarControllerApi();

const useGetFollowUp = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<BarDiscussionFollowUpResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBarDiscussionFollowUp(payload);

      return res.data.data.content;
    },
    queryKey: ['follow-up-data', { payload }],
    ...config,
  });

  return query;
};

export default useGetFollowUp;
