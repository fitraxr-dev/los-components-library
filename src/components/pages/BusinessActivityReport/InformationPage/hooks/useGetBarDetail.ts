import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { BarControllerApi } from '@/services/openapi/master-service';

import type { BarInformationResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BarControllerApi();

const useGetBarDetail = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<BarInformationResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBarDiscussionInformation(payload);

      return res.data.data.content;
    },
    queryKey: ['bar-detail', { payload }],
    ...config,
  });

  return query;
};

export default useGetBarDetail;
