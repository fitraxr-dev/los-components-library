import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getParameterListSubmission } from './constant/getParameterList';

import type { ParameterListRequest, ParameterListResponse } from './constant/getParameterList';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetParameterSubmission = (
  payload: ParameterListRequest,
  config?: Partial<UseQueryOptions<ParameterListResponse>>
) => {
  const query = useQuery<ParameterListResponse>({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return await getParameterListSubmission(payload);
    },
    queryKey: ['parameter-lov-submission', payload],
    ...config,
  });

  return query;
};

export default useGetParameterSubmission;
