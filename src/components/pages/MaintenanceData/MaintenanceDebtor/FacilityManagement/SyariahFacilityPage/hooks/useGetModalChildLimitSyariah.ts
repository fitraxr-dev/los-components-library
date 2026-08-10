import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


;
import type { UseQueryOptions } from '@tanstack/react-query';


interface UseGetModalChildLimitConfig extends Partial<UseQueryOptions<any>> {
  enableRefetch?: boolean;
}

const useGetModalChildLimit = (
  payload: any,
  config?: UseGetModalChildLimitConfig
) => {
  const { enableRefetch = false, ...queryConfig } = config || {};

  const query = useQuery<any>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.facilityManagementSyariahProposed.childLimitlistModal', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    queryKey: ['modal-child-limit-syariah-list', payload],
    refetchInterval: enableRefetch ? 5000 : undefined,
    ...queryConfig,
  });

  return query;
};

export default useGetModalChildLimit;
