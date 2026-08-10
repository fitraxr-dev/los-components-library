import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RiskProfileControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new RiskProfileControllerApi();

const useGetRiskProfileDetail = (
  payload: RequestByProcessIdDtoString
) => {
  const mutation = useQuery({
    queryFn: async () => {
      const res = await api.getDetailRiskProfile(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['identify-risk-depi-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return mutation;
};


export default useGetRiskProfileDetail;
