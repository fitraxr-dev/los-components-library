import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtSecuritiesControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoDebtSecuritiesRequestDto } from '@/services/openapi/master-service';


const api = new DebtSecuritiesControllerApi();

const useGetListDebtSecurities = (
  payload: GenericBucketRequestDtoDebtSecuritiesRequestDto,
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListDebtSecurities(payload);

      return res.data.data;
    },
    queryKey: ['get-list-debt-securities'],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetListDebtSecurities;
