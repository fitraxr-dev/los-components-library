import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDebtorMaster = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload?.bucketProcessId && !!payload?.debtorId && !!payload?.module && !!payload?.process,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.maintenanceCustomer.detail', {
        data: payload,
      });

      return res?.data?.data?.content;
    },
    queryKey: ['debtor-detail-master', payload],
    ...config,
  });

  return query;
};

export default useGetDebtorMaster;
