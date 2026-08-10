import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface GetGroupDetailRequest {
  id: number;
  bucketProcessId: string | null;
}

interface GetGroupDetailResponse {
  operationId?: string | null;
  errorCode?: string;
  errorDesc?: string;
  errorSource?: string;
  errorDetail?: string | null;
  timestamp?: string;
  data?: {
    content?: {
      id?: number;
      bucketProcessId?: string | null;
      applicationType?: string;
      code?: string;
      itemNo?: number;
      isActive?: boolean;
      needConfirmation?: boolean;
      additionalAction?: boolean;
      referenceGroup?: string | null;
      itemGroup?: string;
      createdDate?: string;
      modifiedDate?: string;
      createdBy?: string;
      modifiedBy?: string;
      status?: string | null;
      statusLabel?: string | null;
      group?: any;
      isTabEnabled?: boolean;
      // Add other fields as needed
      [key: string]: any;
    };
  };
  [key: string]: any;
}

const useGetGroupDetail = (
  rawPayload: GetGroupDetailRequest | null,
  config?: Partial<UseQueryOptions<GetGroupDetailResponse>>
) => {
  const payload = rawPayload ? {
    ...rawPayload,
    bucketProcessId: rawPayload.bucketProcessId === 'null' ? null : rawPayload.bucketProcessId,
  } : null;
  const query = useQuery<GetGroupDetailResponse>({
    enabled: !!payload?.id,
    queryFn: async () => {
      if (!payload) throw new Error('Payload is required');
      const response = await API('parameter.parameterApuPpt.groupDetail', { data: payload });
      return response.data;
    },
    queryKey: ['parameter-group-detail', payload],
    ...config,
  });

  return query;
};

export default useGetGroupDetail;
