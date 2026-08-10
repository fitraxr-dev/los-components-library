import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/bucket-document-service';


const api = new DocumentControllerApi();

const useGetMemoReference = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getOwnedDigitalMemoByProcessId(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mup-memo-reference', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetMemoReference;
