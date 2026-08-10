import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { IdentificationLegalRiskControllerApi, type RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new IdentificationLegalRiskControllerApi();

const useGetDetailRiskIdentification = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: !!payload.id,
    queryFn: async () => {
      const res = await api.getDetailIdentificationLegalRisk(payload);

      return res.data.data?.content;
    },
    queryKey: ['risk-identification-detail', payload],
    staleTime: ONE_MINUTE,
  });
  return query;
};

export default useGetDetailRiskIdentification;
