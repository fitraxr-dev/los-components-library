import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { UseQueryOptions } from '@tanstack/react-query';


interface CheckRisalahRapatExpiredRequest {
  bucketProcessId: string;
  module: TypeModule;
  process: TypeProcess;
}

interface CheckRisalahRapatExpiredResponse {
  isExpired: boolean;
  message: string;
}

const useCheckRisalahRapatExpired = (
  payload: CheckRisalahRapatExpiredRequest | undefined,
  config?: Partial<UseQueryOptions<CheckRisalahRapatExpiredResponse>>
) => {
  const enableQuery = !!payload?.bucketProcessId && payload?.module !== undefined && payload?.process !== undefined;

  const query = useQuery({
    enabled: enableQuery,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.risalahRapat.checkExpired', { data: payload });
      return res.data?.data?.content;
    },
    queryKey: ['check-risalah-rapat-expired', payload],
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    ...config,
  });

  return query;
};

export default useCheckRisalahRapatExpired;
