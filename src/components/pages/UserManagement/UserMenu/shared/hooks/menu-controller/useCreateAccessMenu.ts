import { useQuery } from '@tanstack/react-query';

import { MenuControllerApi } from '@/services/openapi/user-management-service';

import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MenuControllerApi;

const useCreateAccessMenu = (
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    queryFn: async () => {

      const res = await api.createAccessMenu;

      return res;
    },
    queryKey: ['create-access-menu'],
    ...config,
  });

  return query;
};

export default useCreateAccessMenu;
