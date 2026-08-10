import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface SkuInformationResponse {
  content: {
    id: number;
    directorateId: string;
    directorateLabel: string;
    divisionId: string;
    divisionLabel: string;
    jobPositionLabel: string;
    staff: number;
    staffName: string;
    skuNo: string;
    skuDate: string;
  };
}

interface SkuInformationRequest {
  bucketProcessId: string;
  staff: number | string;
  module?: string;
  process?: string;
}

const useGetSkuInformation = (
  payload: SkuInformationRequest,
  queryOptions?: Partial<UseQueryOptions<SkuInformationResponse, any, any>>
) => {
  const query = useQuery({
    enabled: Boolean(payload.bucketProcessId && payload.staff),
    queryFn: async () => {
      const res = await API('agreement.risalahRapatCommitteeMeetingInformation.sku', {
        data: {
          bucketProcessId: payload.bucketProcessId,
          module: payload.module,
          process: payload.process,
          staff: payload.staff,
        },
      });

      return res?.data?.data;
    },
    queryKey: ['sku-information', payload.bucketProcessId, payload.staff],
    ...queryOptions,
  });

  return query;
};

export default useGetSkuInformation;
