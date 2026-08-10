import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtorControllerApi } from '@/services/openapi/loan-service';

import type {
  BaseResponseGenericSingleDtoDebtorDetailResponseDto,
  DebtorDetailRequestDto,
  DebtorDetailResponseDto,
} from '@/services/openapi/loan-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DebtorControllerApi();

const useGetDebtorDetailById = (payload: DebtorDetailRequestDto, config?: Partial<UseQueryOptions>) => {
  const query = useQuery<DebtorDetailResponseDto>({
    queryFn: async () => {
      const res = await api.getDebtorDetail(payload);

      return res.data;
    },
    queryKey: ['debtor', { debtorId: payload.debtorId, processId: payload.bucketProcessId }],
    select: (res: BaseResponseGenericSingleDtoDebtorDetailResponseDto) => res?.data.content,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetDebtorDetailById;
