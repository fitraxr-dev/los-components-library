import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ParameterSyariahSummaryItem {
  id: number;
  product: string;
  productCode: string;
  productReference: string;
  productReferenceCode: string;
  isActive: boolean;
  bucketProcessId: string | null;
  status: string;
  statusBucket: string | null;
  actionType: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  attributes: Array<{
    attributeKey: string;
    attributeLabel: string;
    attributeType: string;
  }>;
}

export interface ParameterSyariahSummaryResponse {
  contents: ParameterSyariahSummaryItem[];
}

export interface ParameterSyariahSummaryApiResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: ParameterSyariahSummaryResponse;
}

interface UseGetParameterSyariahSummaryParams {
  id?: number;
  bucketProcessId?: string;
}

const useGetParameterSyariahSummary = (
  params: UseGetParameterSyariahSummaryParams,
  config?: Partial<UseQueryOptions<ParameterSyariahSummaryResponse>>
) => {
  const query = useQuery({
    enabled: Boolean(params.id || params.bucketProcessId),
    queryFn: async () => {
      const payload = {
        ...(params.bucketProcessId && { bucketProcessId: params.bucketProcessId }),
        ...(params.id && { id: params.id }),
      };


      const response = await API('parameter.parameterSkemaSyariah.summary', {
        data: payload,
      });

      return response.data.data;
    },
    queryKey: ['parameter-syariah-summary', params.id, params.bucketProcessId],
    ...config,
  });

  return query;
};

export default useGetParameterSyariahSummary;
