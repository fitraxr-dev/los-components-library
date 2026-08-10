import { useQuery } from '@tanstack/react-query';

import { CollateralControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByCodeAndProcessIdDto, ListCollateralResponseDto } from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CollateralControllerApi();

const useGetCollateralList = (
  payload: RequestByCodeAndProcessIdDto,
  config?: Partial<UseQueryOptions<ListCollateralResponseDto>>
) => {
  const queries = useQuery({
    queryFn: async () => {
      const res = await api.getListCollateral(payload);

      return res.data.data;
    },
    queryKey: ['collateral-list', payload],
    ...config,
  });
  return queries;
};

export default useGetCollateralList;
