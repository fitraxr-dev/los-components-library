import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AssumptionQualificationControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new AssumptionQualificationControllerApi();

const useClarifyingAssumptionsDetail = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailAssumptionQualification(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['clarifying-assumption-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useClarifyingAssumptionsDetail;
