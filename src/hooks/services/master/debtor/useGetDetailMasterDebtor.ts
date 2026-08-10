import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetDetailMasterDebtor = (
  payload: any,
  config?: Partial<any>
) => {
  const query = useQuery({
    enabled: !!payload?.debtorId,
    queryFn: async () => {
      try {
        console.log('Fetching master debtor detail with payload:', payload);

        const res = await API('master.debtor.detail', { data: payload });

        console.log('API response (getDebtorDetail):', res);

        return res?.data?.data?.content ?? null;
      } catch (error) {
        console.error('API error (getDebtorDetail):', error);
        throw error;
      }
    },
    queryKey: ['detail-master-debtor', { id: payload?.debtorId }],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetDetailMasterDebtor;
