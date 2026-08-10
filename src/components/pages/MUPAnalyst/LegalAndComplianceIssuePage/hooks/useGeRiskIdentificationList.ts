import { useQuery } from '@tanstack/react-query';

import { IdentificationLegalRiskControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new IdentificationLegalRiskControllerApi();

const useGetRiskIdentificationList = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListIdentificationLegalRisk(payload);

      return res.data.data?.contents;
    },
    queryKey: ['risk-identification-list', payload],
  });
  return query;
};

export default useGetRiskIdentificationList;
