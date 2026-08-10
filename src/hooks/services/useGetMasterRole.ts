import { useQuery } from '@tanstack/react-query';

import { MasterControllerApi } from '@/services/openapi/user-management-service';

import type { RoleDropDown } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterControllerApi;

const useGetMasterRole = (
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    initialData: [],
    queryFn: async () => {

      const res = await api.retrieveAllRole();
      const data = (res.data.data?.contents as RoleDropDown[])
        .map((obj) => ({ id: obj.code, label: obj.roleName }));
      return data;
    },
    queryKey: ['master-role'],
    ...config,
  });

  return query;
};

export default useGetMasterRole;
