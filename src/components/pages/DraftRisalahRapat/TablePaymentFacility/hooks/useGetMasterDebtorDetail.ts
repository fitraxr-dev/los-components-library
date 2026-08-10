import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetMasterDebtorDetail = (payload: { debtorId: string }, options?: any) => {
  return useQuery<any>({
    enabled: !!payload.debtorId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.debtor.detail', { data: payload });
      return res.data.data.content;
    },
    queryKey: ['master-debtor-detail', payload],
    ...options,
  });
};

export default useGetMasterDebtorDetail;
