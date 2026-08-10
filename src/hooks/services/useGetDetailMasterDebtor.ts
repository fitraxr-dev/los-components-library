import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type { DebtorDetailResponseDto, GetDebtorRequestDto } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DebtorV2ControllerApi();

const useGetDetailMasterDebtor = (
  payload: GetDebtorRequestDto,
  config?: Partial<UseQueryOptions<DebtorDetailResponseDto>>
) => {
  const query = useQuery({
    enabled: payload.debtorId !== undefined && payload.debtorId !== null,
    queryFn: async () => {
      const res = await api.getDebtorDetail(payload);

      return res.data.data.content;
    },
    queryKey: ['detail-master-debtor', { id: payload.debtorId }],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetDetailMasterDebtor;
