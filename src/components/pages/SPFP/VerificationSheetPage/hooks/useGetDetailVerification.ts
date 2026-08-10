import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { VerificationSheetControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/agreement-service';


const api = new VerificationSheetControllerApi() ;

const useGetDetailVerificationSheet = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListDetailVerificationSheet(payload);

      return res?.data?.data?.contents;
    },
    queryKey: ['verification-sheet', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetDetailVerificationSheet;
