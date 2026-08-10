import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceDebtorControllerApi } from '@/services/openapi/master-service';

import type { DebtorRequest } from '@/services/openapi/master-service';


const api = new MaintenanceDebtorControllerApi();

const useGetDebtorDetail = (payload: DebtorRequest) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.applicationDebtor(payload);

      return res.data.data.content;
    },
    queryKey: ['get-debtor-detail', payload],
    select: (data) => data,
  });

  return query;
};

export default useGetDebtorDetail;
