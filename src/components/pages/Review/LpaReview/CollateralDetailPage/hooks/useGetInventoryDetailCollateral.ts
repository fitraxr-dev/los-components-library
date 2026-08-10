import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { CollateralInventoryControllerApi } from '@/services/openapi/lpa-service';

import type { CollateralInventoryResponseDto, RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CollateralInventoryControllerApi() ;

const useGetInventoryDetailCollateral = (
  payload: RequestByCodeAndProcessIdDto,
  config?: Partial<UseQueryOptions<CollateralInventoryResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailCollateralInventory(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['collateral-inventory-detail', payload],
    ...config,
  });

  return query;
};


export default useGetInventoryDetailCollateral;
