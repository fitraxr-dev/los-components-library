import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type {
  GenericSingleDtoValidateResultDebtorResponseDto,
  ValidateResultDebtorRequestDto,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DebtorV2ControllerApi();
// GenericSingleDtoValidateResultDebtorResponseDto

const useGetValidateResult = (
  payload: ValidateResultDebtorRequestDto,
  config?: Partial<UseQueryOptions<any>>

) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.resultValidateDebtor(payload);

      return res.data.data;
    },
    queryKey: ['validate-result', payload],
    ...config,
  });

  return query;
};

export default useGetValidateResult;
