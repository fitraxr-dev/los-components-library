import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


;
import type { UseQueryOptions } from '@tanstack/react-query';


interface UseGetListFinancingFacilitySyariahConfig extends Partial<UseQueryOptions<any>> {
  enableRefetch?: boolean;
}

const useGetListFinancingFacilitySyariah = (
  payload: any,
  config?: UseGetListFinancingFacilitySyariahConfig
) => {
  const { enableRefetch = false, ...queryConfig } = config || {};

  const query = useQuery<any>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.facilityManagementSyariahProposed.financingFacilityList', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    queryKey: ['financing-facility-syariah-list', payload],
    refetchInterval: enableRefetch ? 5000 : undefined,
    ...queryConfig,
  });

  return query;
};

export default useGetListFinancingFacilitySyariah;
