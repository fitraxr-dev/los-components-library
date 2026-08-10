import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { CollateralBoatControllerApi } from '@/services/openapi/lpa-service';

import type { CollateralBoatResponseDto, RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CollateralBoatControllerApi() ;

const useGetBoatDetailCollateral = (
  payload: RequestByCodeAndProcessIdDto,
  config?: Partial<UseQueryOptions<CollateralBoatResponseDto>>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailCollateralBoat(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['collateral-boat-detail', payload],
    ...config,
  });

  return query;
};


export default useGetBoatDetailCollateral;
