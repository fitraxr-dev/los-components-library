import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentControllerApi();

const useGetConfirmAnalyst = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>) => {
  const query = useQuery({
    enabled: !!payload?.bucketProcessId && !!payload?.bucketMasterId,
    queryFn: async () => {
      const response = await API('mip.mipDiscussion.checkConfirmAnalyst', {
        data: payload,
      });
      return response.data?.data?.content;
    },
    queryKey: ['confirm-analyst', payload?.bucketProcessId, payload?.bucketMasterId],
    ...config,
  });

  return query;
};

export default useGetConfirmAnalyst;
