import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface CheckRequestPayload {
  bucketMasterId?: string;
  process?: string;
}

const useCheckRequest = (
  payload: CheckRequestPayload,
  config?: Partial<UseQueryOptions<any>>,
) => useQuery({
  enabled: !!payload?.bucketMasterId && !!payload?.process,
  queryFn: async () => {
    const response = await API('bucket.debtor.checkRequest', { data: payload });
    return response.data?.data;
  },
  queryKey: ['check-request', payload],
  refetchInterval: 5000,
  refetchOnWindowFocus: true,
  ...config,
});

export default useCheckRequest;
