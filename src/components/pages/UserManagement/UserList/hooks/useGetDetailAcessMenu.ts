import { useQuery } from '@tanstack/react-query';

import { AppsMenuControllerApi } from '@/services/openapi/user-management-service';

import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AppsMenuControllerApi;

const useGetDetailAcessMenu = (
  roleId: string,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    enabled: roleId !== undefined,
    queryFn: async () => {
      const payload = {
        bucketProcessId: roleId,
        id: roleId,
      };

      //@ts-ignore
      const res: any = roleId.includes('UM') ? await api.detailRoleAccessDraft(payload) : await api.detailRoleAccess(payload);

      return res.data.data;
    },
    queryKey: ['detail-access-menu'],
    ...config,
  });

  return query;
};

export default useGetDetailAcessMenu;
