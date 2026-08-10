import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type Payload = {
  bucketProcessId: string;
  module: string;
  process: string;
}

type DiffField = {
  changed: boolean;
  dpop: any;
  business: any;
}

type JsonDiffChange = {
  path: string;
  dpop: any;
  business: any;
}

type JsonDiffSummary = {
  changed: boolean;
  changes: JsonDiffChange[];
}

type LpaDiff = {
  id: string;
  bucketProcessId: string;
  changes: boolean;
}

type DiffsContent = {
  jsonDiffSummary?: JsonDiffSummary;
  lpaDiffs?: LpaDiff[];
  [key: string]: DiffField | JsonDiffSummary | LpaDiff[] | undefined;
}

type ResponseContent = {
  hasBusinessUpdate: boolean;
  diffs?: DiffsContent;
}

const useGetConfirmation = (
  payload: Payload,
  config?: Partial<UseQueryOptions<ResponseContent>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('lpa.dpopRequest.difference', {
        data: payload,
      });

      const content = res.data.data.content as any;
      const mapped: ResponseContent = {
        diffs: content?.diffs,
        hasBusinessUpdate: content?.hasBusinessUpdate === true,
      };
      return mapped;
    },
    queryKey: ['lpa-confirmation-difference', payload],
    refetchInterval: 5000,
    ...config,
  });

  return query;
};

export default useGetConfirmation;
