import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { PkRequestControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/agreement-service';


const api = new PkRequestControllerApi();

const useApplicationDetail = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getPKRequest(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['pengajuan-perikatan-permohonan-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useApplicationDetail;
