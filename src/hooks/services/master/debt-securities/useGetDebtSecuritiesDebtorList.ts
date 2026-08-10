import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDebtSecuritiesDebtorList = (
  payload: any,
  config?: Partial<UseQueryOptions<any[]>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.debtSecurities.debtor', {
        data: payload,
      });

      return res.data.data.contents;
    },
    queryKey: ['debt-securities-debtor-list', payload],
    ...config,
  });

  return query;
};

export default useGetDebtSecuritiesDebtorList;
