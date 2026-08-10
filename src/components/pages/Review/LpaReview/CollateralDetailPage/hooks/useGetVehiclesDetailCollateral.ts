import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { CollateralVehicleControllerApi } from '@/services/openapi/lpa-service';

import type { CollateralVehicleResponseDto, RequestByIdDtoString } from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CollateralVehicleControllerApi() ;

const useGetVehiclesDetailCollateral = (
  payload: RequestByIdDtoString,
  config?: Partial<UseQueryOptions<CollateralVehicleResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailCollateralVehicle(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['collateral-vehicle-detail', payload],
    ...config,
  });

  return query;
};


export default useGetVehiclesDetailCollateral;
