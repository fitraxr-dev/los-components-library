import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface PrivySignerResponse {
  id?: number;
  directorateId?: string;
  directorateLabel?: string;
  staffId?: number;
  staffName?: string;
  divisionId?: string;
  divisionLabel?: string;
  jobPositionLabel?: string;
  consentRole?: string;
  consentRoleLabel?: string;
  sequence?: number;
  sku?: any;
  privyId?: string;
  signatureAmount?: number;
}

interface GetPrivySignersRequest {
  bucketProcessId: string;
  module: string;
  process: string;
}

interface GetPrivySignersResponse {
  contents: PrivySignerResponse[];
}

const useGetPrivySigners = (
  payload: GetPrivySignersRequest,
  queryOptions?: Partial<UseQueryOptions<GetPrivySignersResponse, any, any>>
) => {
  const query = useQuery({
    enabled: Boolean(payload.bucketProcessId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('agreement.risalahRapatPrivy.getSigners', {
        data: payload,
      });

      return res?.data?.data;
    },
    ...queryOptions,
    queryKey: ['privy-signers', payload],
  });

  return query;
};

export default useGetPrivySigners;
