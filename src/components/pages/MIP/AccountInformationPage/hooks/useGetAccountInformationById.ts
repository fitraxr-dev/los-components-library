import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtorAccountInformationControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new DebtorAccountInformationControllerApi();

const useGetAccontInformationById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: Object.values(payload).every((value) => !!value),
    queryFn: async () => {
      const res = await api.getDetailDebtorAccountInformation(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mip-account-information', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetAccontInformationById;
