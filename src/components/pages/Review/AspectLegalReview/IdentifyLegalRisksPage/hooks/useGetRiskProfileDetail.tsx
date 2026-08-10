import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { IdentificationLegalRiskControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new IdentificationLegalRiskControllerApi();

const useIdentifyRisksDetail = (
  payload: RequestByProcessIdDtoString
) => {
  const mutation = useQuery({
    queryFn: async () => {
      const res = await api.getDetailIdentificationLegalRisk(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['identify-risk-dh-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return mutation;
};


export default useIdentifyRisksDetail;
