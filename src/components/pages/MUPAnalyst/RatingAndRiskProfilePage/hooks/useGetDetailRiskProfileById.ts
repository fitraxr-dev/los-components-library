import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RiskProfileControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new RiskProfileControllerApi() ;

const useGetDetailRiskProfileById = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailRiskProfile(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['risk-profile-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailRiskProfileById;
