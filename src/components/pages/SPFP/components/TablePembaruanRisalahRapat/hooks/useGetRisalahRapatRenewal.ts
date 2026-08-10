import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface RisalahRapatRenewalPayload {
  filter?: {
    bucketProcessId?: string;
    module?: string;
    process?: string;
  };
  page?: {
    itemPerPage: number;
    noPage: number;
  };
}

interface RisalahRapatRenewalResponse {
  contents?: any[];
  page?: {
    totalItem: number;
    totalPage: number;
  };
}

const useGetRisalahRapatRenewal = (
  payload: RisalahRapatRenewalPayload,
  config?: Partial<UseQueryOptions<RisalahRapatRenewalResponse>>
) => {
  const query = useQuery<RisalahRapatRenewalResponse>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucketDocument.document.getRisalahRapatRenewal', {
        data: payload,
      });
      return res.data?.data ?? {};
    },
    queryKey: ['risalah-rapat-renewal', payload],
    ...config,
  });
  return query;
};

export default useGetRisalahRapatRenewal;
