import { useQuery } from '@tanstack/react-query';

import { MaintenanceDebtorControllerApi } from '@/services/openapi/master-service';

import type { DebtorRequest } from '@/services/openapi/master-service';


const api = new MaintenanceDebtorControllerApi();

const useGetDebtorRemark = (payload: DebtorRequest) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.retrieveDescription1(payload);
      const debtorData = res.data.data.content;

      return debtorData;
    },
    queryKey: ['debtor-description'],
  });

  return query;
};

export default useGetDebtorRemark;
