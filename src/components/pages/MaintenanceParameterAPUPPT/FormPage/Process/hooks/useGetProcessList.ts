import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface GetProcessListRequest {
  filter?: {
    id?: string;
    bucketProcessId?: string;
  };
  page?: {
    itemPerPage?: number;
    noPage?: number;
  };
  searchDetail?: {
    key?: string;
    value?: string;
  };
}

interface ProcessListItem {
  id?: string;
  kode?: string;
  label?: string;
  status?: string;
  // Add other fields as needed
  [key: string]: any;
}

interface GetProcessListResponse {
  operationId?: string | null;
  errorCode?: string;
  errorDesc?: string;
  errorSource?: string;
  errorDetail?: string | null;
  timestamp?: string;
  data?: {
    contents?: ProcessListItem[];
    page?: {
      totalPage?: number;
      totalItem?: number;
      itemPerPage?: number;
      noPage?: number;
    };
  };
  // Allow for different response structures
  [key: string]: any;
}

const useGetProcessList = (
  payload: GetProcessListRequest | null,
  config?: Partial<UseQueryOptions<GetProcessListResponse>>
) => {
  const query = useQuery<GetProcessListResponse>({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      if (!payload) throw new Error('Payload is required');

      const response = await API('parameter.parameterApuPpt.processList', { data: payload });
      return response.data;
    },
    queryKey: ['parameter-apu-ppt-process-list', payload],
    ...config,
  });

  return query;
};

export default useGetProcessList;
