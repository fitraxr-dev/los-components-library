import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type Payload = {
  bucketProcessId: string;
}

type ResponseContent = {
  hasBusinessUpdate: boolean;
  delst?: any;
  business?: any;
  diffs?: {
    [key: string]: {
      changed: boolean;
      delst: any;
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
      const res = await API('technicalReview.delstRequest.difference', {
        data: payload,
      });

      const content = res.data.data.content as any;
      const mapped: ResponseContent = {
        business: content?.business,
        delst: content?.delst,
        diffs: content?.diffs,
        hasBusinessUpdate: content?.hasBusinessUpdate === true,
      };
      return mapped;
    },
    queryKey: ['technical-review-confirmation-difference', payload],
    refetchInterval: 5000,
    ...config,
  });

  return query;
};

export default useGetConfirmation;
