import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  getParameterListSubmission,
  type ParameterListRequest,
  type ParameterListResponse,
} from './constant/getParameterList';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetParameterListSubmission = (
  payload: ParameterListRequest,
  config?: Partial<UseQueryOptions<ParameterListResponse>>
) => {
  const query = useQuery<ParameterListResponse>({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return await getParameterListSubmission(payload);
    },
    queryKey: ['parameter-va-submission', payload],
    ...config,
  });

  return query;
};

export default useGetParameterListSubmission;
