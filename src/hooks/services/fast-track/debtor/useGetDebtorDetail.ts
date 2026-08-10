import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface DebtorDetailPayload {
  bucketProcessId: string;
  referenceCode: string;
  summaryId: number | null;
}

const useGetDebtorDetail = (payload: DebtorDetailPayload) => {
  const query = useQuery({
    enabled: !!payload?.bucketProcessId && !!payload?.referenceCode,
    queryFn: async () => {
      try {
        console.log('Fetching debtor detail with payload:', payload);

        const res = await API('fastTrack.detail.debtor', { data: payload });

        console.log('API response (debtor detail):', res);

        return res?.data?.data?.content ?? null;
      } catch (error) {
        console.error('API error (debtor detail):', error);
        throw error;
      }
    },
    queryKey: ['mns-debtor-detail', payload?.bucketProcessId, payload?.referenceCode, payload?.summaryId],
  });

  return query;
};

export default useGetDebtorDetail;
