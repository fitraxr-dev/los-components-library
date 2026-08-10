import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AssumptionQualificationControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/agreement-service';


const api = new AssumptionQualificationControllerApi();

const useGetDetailAsumsi = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailAssumptionQualification(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['ls-asumsi-kualifikasi', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailAsumsi;
