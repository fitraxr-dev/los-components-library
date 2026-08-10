import { useQuery } from '@tanstack/react-query';

import { MenuControllerApi } from '@/services/openapi/user-management-service';

import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MenuControllerApi;

const useRetrieveAllMenuAccess = (
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    queryFn: async () => {

      const res = await api.retrieveAllMenuAccess;

      return res;
    },
    queryKey: ['master-division'],
    ...config,
  });

  return query;
};

export default useRetrieveAllMenuAccess;
