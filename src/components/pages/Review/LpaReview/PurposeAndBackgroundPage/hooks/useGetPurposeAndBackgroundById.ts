import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { PurposeAndBackgroundControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/lpa-service';


const api = new PurposeAndBackgroundControllerApi();

const useGetPurposeAndBackgroundById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailPurposeAndBackground(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['peer-and-comparison', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetPurposeAndBackgroundById;
