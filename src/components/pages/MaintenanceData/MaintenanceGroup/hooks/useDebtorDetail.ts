import { useQuery } from '@tanstack/react-query';

import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type { GetDebtorRequestDto } from '@/services/openapi/master-service';


const api = new DebtorV2ControllerApi();

const useDetailDebtor = (payload: GetDebtorRequestDto) => {
  return useQuery({
    enabled: !!(payload?.debtorId),
    queryFn: async () => {
      const res = await api.getDebtorDetail(payload);
      return res?.data;
    },
    queryKey: ['get-debtor-detail', payload],
  });
};

export default useDetailDebtor;
