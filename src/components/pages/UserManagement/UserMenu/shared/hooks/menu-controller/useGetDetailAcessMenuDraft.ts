import { useQuery } from '@tanstack/react-query';

import { MenuControllerApi } from '@/services/openapi/user-management-service';

import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MenuControllerApi;

const useGetDetailAcessMenuDraft = (
  bucketProcessId: string,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    queryFn: async () => {
      const payload = {
        bucketProcessId,
      };

      const res = await api.detailAccessMenuDraft(payload);

      return res;
    },
    queryKey: ['detail-draft-access-menu'],
    ...config,
  });

  return query;
};

export default useGetDetailAcessMenuDraft;
