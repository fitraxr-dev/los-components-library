import { useQuery } from '@tanstack/react-query';

import getParameterByModule from '@/components/pages/MaintenanceParameterBar/hooks/constant/getParameterByModule';

import type {
  ParameterByModuleResponse,
} from '@/components/pages/MaintenanceParameterBar/hooks/constant/getParameterByModule';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetParameterByModuleCustom = (
  module: string,
  config?: Partial<UseQueryOptions<ParameterByModuleResponse>>
) => {
  const query = useQuery<ParameterByModuleResponse>({
    enabled: !!module, // Only run query when module is provided
    queryFn: async () => {
      return await getParameterByModule({ module });
    },
    queryKey: ['parameter-by-module-custom', module],
    ...config,
  });

  return query;
};

export default useGetParameterByModuleCustom;
