import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { CollateralComplementaryFacilitiesControllerApi } from '@/services/openapi/lpa-service';

import type {
  CollateralComplementaryFacilitiesResponseDto,
  RequestByCodeAndProcessIdDto,
} from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CollateralComplementaryFacilitiesControllerApi() ;

const useGetComplementaryFacilitiesDetailCollateral = (
  payload: RequestByCodeAndProcessIdDto,
  config?: Partial<UseQueryOptions<CollateralComplementaryFacilitiesResponseDto>>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailCollateralComplementaryFacilities(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['collateral-complementary-facilities-detail', payload],
    ...config,
  });

  return query;
};


export default useGetComplementaryFacilitiesDetailCollateral;
