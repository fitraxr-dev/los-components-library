import { useQuery } from '@tanstack/react-query';

import { AccessMenuControllerApi } from '@/services/openapi/user-management-service';

import type { AccessMenuSearchRequest, GeneralLabelString } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AccessMenuControllerApi();

const useGetLosMenuList = (
  payload?: AccessMenuSearchRequest,
  config?: Partial<UseQueryOptions<GeneralLabelString[]>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.retrieveSearchMenu(payload);

      return res.data.data.contents;
    },
    queryKey: ['access-menu-los-menu-list', payload],
    ...config,
  });

  return query;
};

export default useGetLosMenuList;
