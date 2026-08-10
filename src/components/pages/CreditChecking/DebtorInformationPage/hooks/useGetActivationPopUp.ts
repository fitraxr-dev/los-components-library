import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ActivationRequest {
  debtorId: string;
}
const useGetActivationPopUp = (
  payload: ActivationRequest,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const response = await API('master.creditChecking.validation', { data: payload });
        return response.data.data.content;
      } catch (error) {
        throw error;
      }
    },
    queryKey: ['cc-validation', payload],
    ...config,
  });

  return query;
};

export default useGetActivationPopUp;
