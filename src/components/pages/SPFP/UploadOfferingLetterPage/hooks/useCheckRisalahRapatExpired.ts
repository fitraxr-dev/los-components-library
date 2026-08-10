import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface CheckExpiredPayload {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

interface CheckExpiredResponse {
  isExpired: boolean;
  isTerminated: boolean;
  message: string;
}

const useCheckRisalahRapatExpired = (
  payload: CheckExpiredPayload,
  config?: Partial<UseQueryOptions<CheckExpiredResponse>>
) => {
  const query = useQuery<CheckExpiredResponse>({
    enabled: !!payload?.bucketProcessId && !!payload?.module && !!payload?.process,
    queryFn: async () => {
      const res = await API('bucket.risalahRapat.checkExpired', {
        data: payload,
      });
      return res.data?.data?.content;
    },
    queryKey: ['risalah-rapat-check-expired', payload],
    ...config,
  });
  return query;
};

export default useCheckRisalahRapatExpired;
