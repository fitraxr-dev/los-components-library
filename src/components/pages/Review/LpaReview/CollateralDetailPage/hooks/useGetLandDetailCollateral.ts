import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { CollateralLandControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByIdDtoString, CollateralLandResponseDto } from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CollateralLandControllerApi() ;

const useGetLandDetailCollateral = (
  payload: RequestByIdDtoString,
  config?: Partial<UseQueryOptions<CollateralLandResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailCollateralLand(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['collateral-land-detail', payload],
    ...config,
  });

  return query;
};


export default useGetLandDetailCollateral;
