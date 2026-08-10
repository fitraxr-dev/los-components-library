import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ParameterSyariahAttribute {
  attributeKey: string;
  attributeLabel: string;
  attributeType: string;
  attributeIsActive: boolean;
  createdBy: string;
  modifiedBy: string;
  createdDate: string;
  modifiedDate: string;
}

export interface ParameterSyariahDetailResponse {
  id: number;
  product?: string;
  productCode?: string;
  productCodeReference?: string;
  isActive: boolean;
  attributes: ParameterSyariahAttribute[];
}

export interface ParameterSyariahDetailApiResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: ParameterSyariahDetailResponse;
}

interface UseGetParameterSyariahDetailParams {
  id: number | string;
}

const useGetParameterSyariahDetail = (
  params: UseGetParameterSyariahDetailParams,
  config?: Partial<UseQueryOptions<ParameterSyariahDetailResponse>>
) => {
  const query = useQuery({
    enabled: Boolean(params.id) && params.id !== 0,
    queryFn: async () => {
      const isNumericId = typeof params.id === 'number' || (typeof params.id === 'string' && /^\d+$/.test(params.id));

      const endpointKey = isNumericId
        ? 'parameter.parameterSkemaSyariah.detail'
        : 'parameter.parameterSkemaSyariah.submissionDetail';

      const response = await API(endpointKey as any, {
        data: isNumericId ? { id: params.id } : { bucketProcessId: params.id },
      });

      return isNumericId ? response.data.data : response.data.data.content;
    },
    queryKey: ['parameter-syariah-detail', params.id],
    ...config,
  });

  return query;
};

export default useGetParameterSyariahDetail;
