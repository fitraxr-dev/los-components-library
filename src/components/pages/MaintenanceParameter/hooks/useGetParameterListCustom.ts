import { keepPreviousData, useQuery } from '@tanstack/react-query';

import getParameterList, { type ParameterListRequest, type ParameterListResponse } from './constant/getParameterList';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetParameterListCustom = (
  payload: ParameterListRequest,
  config?: Partial<UseQueryOptions<ParameterListResponse>>
) => {
  const query = useQuery<ParameterListResponse>({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return await getParameterList(payload);
    },
    queryKey: ['parameter-lov-list-custom', payload],
    ...config,
  });

  return query;
};

export default useGetParameterListCustom;
