import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


;
import type { UseQueryOptions } from '@tanstack/react-query';


interface UseGetListParentLimitSyariahConfig extends Partial<UseQueryOptions<any>> {
  enableRefetch?: boolean;
}

const useGetListParentLimitSyariah = (
  payload: any,
  config?: UseGetListParentLimitSyariahConfig
) => {
  const { enableRefetch = false, ...queryConfig } = config || {};

  const query = useQuery<any>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.facilityManagementSyariahProposed.parentLimitList', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    queryKey: ['parent-limit-syariah-list', payload],
    refetchInterval: enableRefetch ? 5000 : undefined,
    ...queryConfig,
  });

  return query;
};

export default useGetListParentLimitSyariah;
