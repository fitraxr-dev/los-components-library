import { useQuery } from '@tanstack/react-query';

import getParameterList, {
  type ParameterListRequest,
  type ParameterListResponse,
} from '@/components/pages/MaintenanceParameterBar/hooks/constant/getParameterList';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetParameterListCustom = (
  payload: ParameterListRequest,
  config?: Partial<UseQueryOptions<ParameterListResponse>>
) => {
  const query = useQuery<ParameterListResponse>({
    enabled: true, // Always enabled since payload structure is different
    queryFn: async () => {
      return await getParameterList(payload);
    },
    queryKey: ['parameter-list-custom', payload],
    ...config,
  });

  return query;
};

export default useGetParameterListCustom;
