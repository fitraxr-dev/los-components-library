import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface GetDetailRequest {
  bucketProcessId: string | null;
  id: string;
}

interface GetDetailResponse {
  operationId?: string | null;
  errorCode?: string;
  errorDesc?: string;
  errorSource?: string;
  errorDetail?: string | null;
  timestamp?: string;
  data?: {
    content?: {
      id?: string;
      groupName?: string;
      modifiedBy?: string;
      modifiedDate?: string;
      isEditable?: boolean;
      bucketProcessId?: string;
      status?: string;
      statusLabel?: string;
      // Add other fields as needed
      [key: string]: any;
    };
  };
  // Allow for different response structures
  [key: string]: any;
}

const useGetDetail = (
  rawPayload: GetDetailRequest | null,
  config?: Partial<UseQueryOptions<GetDetailResponse>>
) => {
  const payload = rawPayload ? {
    ...rawPayload,
    bucketProcessId: rawPayload.bucketProcessId === 'null' ? null : rawPayload.bucketProcessId,
  } : null;

  const query = useQuery<GetDetailResponse>({
    enabled: !!payload?.id,
    queryFn: async () => {
      const response = await API('parameter.parameterApuPpt.detail', { data: payload });
      return response.data;
    },
    queryKey: ['parameter-apu-ppt-detail', payload],
    ...config,
  });

  return query;
};

export default useGetDetail;
