import { useQuery } from '@tanstack/react-query';

import { MenuControllerApi } from '@/services/openapi/user-management-service';

import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MenuControllerApi;

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
      const res: any = roleId.includes('UM') ? await api.detailAccessMenuDraft(payload) : await api.detailAccessMenu(payload);

      return res.data.data;
    },
    queryKey: ['detail-access-menu'],
    ...config,
  });

  return query;
};

export default useGetDetailAcessMenu;
