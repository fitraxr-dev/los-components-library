import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { CollateralControllerApi, ReviewControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';


const api = new CollateralControllerApi() ;

const useGetDetailCollateral = (payload: RequestByCodeAndProcessIdDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailCollateral(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['collateral-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailCollateral;
