import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface RisalahRapatMergedPayload {
  filter?: {
    bucketProcessId?: string;
    module?: string;
    ownership?: string;
    process?: string;
  };
  page?: {
    itemPerPage: number;
    noPage: number;
  };
}

interface RisalahRapatMergedResponse {
  contents?: any[];
  page?: {
    totalItem: number;
    totalPage: number;
  };
}

const useGetRisalahRapatMerged = (
  payload: RisalahRapatMergedPayload,
  config?: Partial<UseQueryOptions<RisalahRapatMergedResponse>>
) => {
  const query = useQuery<RisalahRapatMergedResponse>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucketDocument.document.getRisalahRapatMerged', {
        data: payload,
      });
      return res.data?.data ?? {};
    },
    queryKey: ['risalah-rapat-merged', payload],
    ...config,
  });
  return query;
};

export default useGetRisalahRapatMerged;
