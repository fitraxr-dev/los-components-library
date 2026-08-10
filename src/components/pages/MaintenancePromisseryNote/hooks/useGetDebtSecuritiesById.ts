import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtSecuritiesControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoLong } from '@/services/openapi/master-service';


const api = new DebtSecuritiesControllerApi();

const useGetDebtSecurityById = (
  payload: RequestByIdDtoLong,
) => {
  const query = useQuery({
    enabled: !!payload.id,
    queryFn: async () => {
      const res = await api.getDetailDebtSecuritiesDebtor(payload);

      return res.data.data.content;
    },
    queryKey: ['get-detail-debt-securities', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetDebtSecurityById;
