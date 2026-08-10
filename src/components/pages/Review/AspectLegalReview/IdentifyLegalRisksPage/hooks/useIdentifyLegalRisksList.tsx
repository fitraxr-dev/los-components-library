import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { IdentificationLegalRiskControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new IdentificationLegalRiskControllerApi();

const useIdentifyLegalRisksList = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListIdentificationLegalRisk(payload);

      return res?.data?.data?.contents;
    },
    queryKey: ['identify-legal-risks-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useIdentifyLegalRisksList;
