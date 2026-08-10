import { useQuery } from '@tanstack/react-query';

import { MenuControllerApi } from '@/services/openapi/user-management-service';

import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MenuControllerApi;

const useGetAllMenu = (
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    initialData: [],
    queryFn: async () => {
      const res = await api.allAppsMenu();

      return res.data.data.menu;
    },
    queryKey: ['user-management-list'],
    ...config,
  });

  return query;
};

export default useGetAllMenu;
