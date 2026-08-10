import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type Payload = {
  bucketMasterId: string;
  bucketProcessId: string;
  process: string;
  module: string;
  request: boolean;
  bucketParentId: string;
}

type ResponseContent = {
  bucketProcessId: string;
  hasPreviousCompleted: boolean;
}

const useGetLatestRequest = (
  payload: Payload,
  config?: Partial<UseQueryOptions<ResponseContent>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.latest.request', {
        data: payload,
      });

      const content = res.data.data.content as any;
      const mapped: ResponseContent = {
        bucketProcessId: content?.bucketProcessId || '',
        hasPreviousCompleted: content?.hasPreviousCompleted === true,
      };
      return mapped;
    },
    queryKey: ['bucket-latest-request', payload],
    ...config,
  });

  return query;
};

export default useGetLatestRequest;
