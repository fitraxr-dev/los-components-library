import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface ShareholderDetailPayload {
  bucketProcessId: string;
  referenceCode: string;
  summaryId: number | null;
}

const useGetShareholderDetail = (
  payload: ShareholderDetailPayload,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload?.bucketProcessId && !!payload?.referenceCode,
    queryFn: async () => {
      try {
        const res = await API('creditChecking.detail.shareholder', { data: payload });

        return res?.data?.data?.content ?? null;
      } catch (error) {
        throw error;
      }
    },
    queryKey: ['mns-shareholder-detail', payload?.bucketProcessId, payload?.referenceCode, payload?.summaryId],
    ...config,
  });

  return query;
};

export default useGetShareholderDetail;
