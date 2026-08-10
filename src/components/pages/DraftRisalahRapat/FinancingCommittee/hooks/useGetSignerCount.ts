import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface GetSignerCountRequest {
  bucketProcessId: string;
  module: string;
  process: string;
};

const useGetSignerCount = (
  payload: GetSignerCountRequest,
  queryConfig?: Partial<UseQueryOptions<any, any, any>>
) => {
  const query = useQuery({
    enabled: Boolean(payload?.bucketProcessId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('agreement.risalahRapatConsentSheet.countSigner', { data: payload });

      return res.data?.data;
    },
    queryKey: ['signer-count', payload],
    ...queryConfig,
  });

  return query;
};

export default useGetSignerCount;
