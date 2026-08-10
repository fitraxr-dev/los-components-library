import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtorProfileInformationControllerApi } from '@/services/openapi/mip-service';

import type { GenericWithPreviousDataRequestDto } from '@/services/openapi/mip-service';


const api = new DebtorProfileInformationControllerApi();

const useGetDebtorProfileInformation = (payload: GenericWithPreviousDataRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDetailDebtorProfileInformation(payload);

      return res;
    },
    queryKey: ['get-debtor-information', {
      bucketProcessId: payload.bucketProcessId,
      module: payload.module,
      process: payload.process,
    }],
    select: (response) => response.data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetDebtorProfileInformation;
