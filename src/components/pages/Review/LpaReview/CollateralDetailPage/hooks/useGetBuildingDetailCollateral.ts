import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { CollateralBuildingControllerApi } from '@/services/openapi/lpa-service';

import type { CollateralBuildingResponseDto, RequestByIdDtoString } from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CollateralBuildingControllerApi() ;

const useGetBuildingDetailCollateral = (
  payload: RequestByIdDtoString,
  config?: Partial<UseQueryOptions<CollateralBuildingResponseDto>>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailCollateralBuilding(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['collateral-building-detail', payload],
    ...config,
  });

  return query;
};


export default useGetBuildingDetailCollateral;
