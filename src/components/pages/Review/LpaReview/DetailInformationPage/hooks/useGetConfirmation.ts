import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type Payload = {
  code: string;
  bucketProcessId: string;
  module: string;
  process: string;
}

type ResponseContent = {
  hasBusinessUpdate: boolean;
  dpop?: any;
  business?: any;
  diffs?: {
    [key: string]: {
      changed: boolean;
      dpop: any;
      business: any;
      changes?: any[];
    };
  };
}

const useGetConfirmation = (
  payload: Payload,
  config?: Partial<UseQueryOptions<ResponseContent>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('lpa.dpopRequest.differenceDetail', {
        data: payload,
      });

      const content = res.data.data.content as any;
      const mapped: ResponseContent = {
        business: content?.business,
        diffs: content?.diffs,
        dpop: content?.dpop,
        hasBusinessUpdate: content?.hasBusinessUpdate === true,
      };
      return mapped;
    },
    queryKey: ['lpa-confirmation-difference', payload],
    ...config,
  });

  return query;
};

export default useGetConfirmation;
