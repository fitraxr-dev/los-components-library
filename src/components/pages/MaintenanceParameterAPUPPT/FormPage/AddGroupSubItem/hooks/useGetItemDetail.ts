import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface GetItemDetailRequest {
  id: number;
  bucketProcessId: string;
}

interface GetItemDetailResponse {
  operationId?: string | null;
  errorCode?: string;
  errorDesc?: string;
  errorSource?: string;
  errorDetail?: string | null;
  timestamp?: string;
  data?: {
    content?: {
      id?: number;
      bucketProcessId?: string;
      applicationType?: string;
      code?: string;
      itemNo?: number;
      isActive?: boolean;
      needConfirmation?: boolean;
      additionalAction?: boolean;
      referenceItem?: string | null;
      item?: string;
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

const useGetItemDetail = (
  rawPayload: GetItemDetailRequest | null,
  config?: Partial<UseQueryOptions<GetItemDetailResponse>>
) => {
  const payload = rawPayload ? {
    ...rawPayload,
    bucketProcessId: rawPayload.bucketProcessId === 'null' ? null : rawPayload.bucketProcessId,
  } : null;

  const query = useQuery<GetItemDetailResponse>({
    enabled: !!payload?.id,
    queryFn: async () => {
      if (!payload) throw new Error('Payload is required');
      const response = await API('parameter.parameterApuPpt.itemDetail', { data: payload });
      return response.data;
    },
    queryKey: ['parameter-item-detail', payload],
    ...config,
  });

  return query;
};

export default useGetItemDetail;
