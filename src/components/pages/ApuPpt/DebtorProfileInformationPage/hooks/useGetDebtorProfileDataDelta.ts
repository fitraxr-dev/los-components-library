import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { DebtorProfileInformationControllerApi } from '@/services/openapi/mip-service';

import type {
  DataDeltaResponseDtoDebtorProfileInformationResponseDto,
  GenericWithPreviousDataRequestDto,
} from '@/services/openapi/mip-service';


const api = new DebtorProfileInformationControllerApi();

const useGetDebtorProfileDataDelta = (
  payload: GenericWithPreviousDataRequestDto,
  config?: Partial<UseQueryOptions<DataDeltaResponseDtoDebtorProfileInformationResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {

      const res = await api.getDataDeltaDebtorProfileInformation(payload);
      return res.data.data.content;
    },
    queryKey: ['debtor-document-data-delta', payload],
    ...config,
  });

  return query;
};

export default useGetDebtorProfileDataDelta;
