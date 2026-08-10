import { useQuery } from '@tanstack/react-query';

import { MenuControllerApi } from '@/services/openapi/user-management-service';

import type { RoleAccessMenuRequest } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MenuControllerApi;

const useUpdateAccessMenu = (
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    queryFn: async () => {

      const payload: RoleAccessMenuRequest = {

      };

      const res = await api.updateAccessMenu(payload);

      return res;
    },
    queryKey: ['master-division'],
    ...config,
  });

  return query;
};

export default useUpdateAccessMenu;
