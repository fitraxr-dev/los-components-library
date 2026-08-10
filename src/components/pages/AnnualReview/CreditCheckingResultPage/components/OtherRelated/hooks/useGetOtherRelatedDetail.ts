import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface OtherRelatedDetailPayload {
  bucketProcessId: string;
  referenceCode: string;
  summaryId: number | null;
}

const useGetOtherRelatedDetail = (
  payload: OtherRelatedDetailPayload,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload?.bucketProcessId && !!payload?.referenceCode,
    queryFn: async () => {
      try {
        const res = await API('creditChecking.detail.otherRelated', { data: payload });

        return res?.data?.data?.content ?? null;
      } catch (error) {
        throw error;
      }
    },
    queryKey: ['mns-other-related-detail', payload?.bucketProcessId, payload?.referenceCode, payload?.summaryId],
    ...config,
  });

  return query;
};

export default useGetOtherRelatedDetail;
