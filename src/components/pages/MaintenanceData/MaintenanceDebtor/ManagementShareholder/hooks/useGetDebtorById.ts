import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type { DebtorDetailResponseDto, GetDebtorRequestDto } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const master = new DebtorV2ControllerApi();

const useGetDebtorById = (
  payload: GetDebtorRequestDto,
  config?: Partial<UseQueryOptions<DebtorDetailResponseDto>>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await master.getDebtorDetail(payload);

        return res.data.data.content;
      },
      queryKey: ['debtor', payload],
      ...config,
    }
  );

  return query;
};


export default useGetDebtorById;
