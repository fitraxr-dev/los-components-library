import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetCddItemList = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const response = await API('parameter.parameterGroup.list', { data: payload });
        return response.data?.data;
      } catch (error) {
        throw error;
      }
    },
    queryKey: ['parameter-cdd-item-list', payload],
    ...config,
  });

  return query;
};

export default useGetCddItemList;
