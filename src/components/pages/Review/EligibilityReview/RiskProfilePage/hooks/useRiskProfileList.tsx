import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RiskProfileControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new RiskProfileControllerApi();

const useIdentifyLegalRisksList = (
  payload: RequestByProcessIdDtoString,
) => {
  const query = useQuery(
    {
      queryFn: async () => {
        const res = await api.getListRiskProfile(payload);
        return res.data.data.contents;
      },
      queryKey: ['identify-legal-risks-detail', payload],
      staleTime: ONE_MINUTE,
    }
  );
  return query;
};


export default useIdentifyLegalRisksList;
