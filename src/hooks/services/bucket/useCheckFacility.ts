import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface CheckFacilityPayload {
  bucketProcessId: string;
}

const useCheckFacility = (
  payload: CheckFacilityPayload,
  enableRefetchInterval: boolean = true,
  config?: Partial<UseQueryOptions<any>>,
) => useQuery({
  enabled: !!payload?.bucketProcessId,
  queryFn: async () => {
    const response = await API('bucket.financialFacility.checkFacility', { data: payload });
    return response.data?.data;
  },
  queryKey: ['check-facility', payload],
  refetchInterval: enableRefetchInterval ? 5000 : false,
  refetchOnWindowFocus: true,
  ...config,
});

export default useCheckFacility;
