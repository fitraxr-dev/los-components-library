import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface ApprovalStatusListRequest {
  filter: {
    module?: string;
    bucketProcessId?: string;
    status?: string[];
    startModifiedDate?: string;
    endModifiedDate?: string;
    [key: string]: any;
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
  searchDetail: {
    key: string;
    value: string;
  };
  sortList?: {
    columnName: string;
    sortType: 'asc' | 'desc';
  };
}

export interface ApprovalStatusListResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: {
    contents: Array<{
      id: number;
      bucketProcessId: string;
      code: string;
      description: string;
      modifiedBy: string;
      modifiedDate: string;
      status: string;
      statusLabel: string;
    }>;
    page: {
      totalPage: number;
      totalItem: number;
      itemPerPage: number;
      noPage: number;
    };
  };
}

const getApprovalStatusList = async (payload: ApprovalStatusListRequest): Promise<ApprovalStatusListResponse> => {
  try {
    console.log('Bar ApprovalStatus API Payload:', payload);
    const response = await API('parameter.parameterBar.parameterSubmission', { data: payload });
    console.log('Bar ApprovalStatus API Response:', response);
    return response.data;
  } catch (error) {
    console.error('Bar ApprovalStatus API Error:', error);
    throw error;
  }
};

const useGetApprovalStatusList = (payload: ApprovalStatusListRequest) => {
  const query = useQuery<ApprovalStatusListResponse>({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return await getApprovalStatusList(payload);
    },
    queryKey: ['approval-status-list', payload],
    // Force refetch every time to ensure fresh data when modal opens
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0, // Data is considered stale immediately
  });

  return query;
};

export default useGetApprovalStatusList;
