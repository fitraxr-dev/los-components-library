import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { AskForInfoControllerApi } from '@/services/openapi/technical-review-service';

import type { GetAskForInfoDto } from '@/services/openapi/technical-review-service';


const api = new AskForInfoControllerApi();

const useGetNote = (payload: GetAskForInfoDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getAskForInfo(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['technical-review-note', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetNote;
