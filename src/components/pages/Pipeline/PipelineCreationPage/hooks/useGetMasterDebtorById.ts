import { useQuery } from '@tanstack/react-query';

import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type {
  BaseResponseGenericSingleDtoDebtorDetailResponseDto,
  DebtorDetailResponseDto,
  GetDebtorRequestDto,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DebtorV2ControllerApi();

const useGetMasterDebtorById = (payload: GetDebtorRequestDto, config?: Partial<UseQueryOptions>) => {
  const query = useQuery<DebtorDetailResponseDto>({
    queryFn: async () => {
      const res = await api.getDebtorDetail(payload);

      return res.data;
    },
    queryKey: ['master-debtor', payload],
    select: (res: BaseResponseGenericSingleDtoDebtorDetailResponseDto) => res?.data?.content,
    ...config,
  });

  return query;
};

export default useGetMasterDebtorById;
