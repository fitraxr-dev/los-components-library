import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface ApprovalStatusListRequest {
  filter: {
    status?: string[];
    startLastModifiedDate?: string;
    endLastModifiedDate?: string;
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
    [key: string]: any;
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
      parameterCode: string;
      parameterName: string;
      requestedBy: string;
      requestedDate: string;
      approvedBy: string;
      approvedDate: string;
      status: string;
    }>;
    page: {
      noPage: number;
      itemPerPage: number;
      totalPage: number;
      totalData: number;
    };
  };
}

const getApprovalStatusList = async (payload: ApprovalStatusListRequest): Promise<ApprovalStatusListResponse> => {
  try {
    const response = await API('parameter.parameterApuPpt.listSubmissionBudd', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const useGetApprovalStatusList = (payload: ApprovalStatusListRequest) => {
  const query = useQuery<ApprovalStatusListResponse>({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return await getApprovalStatusList(payload);
    },
    queryKey: ['approval-status-list', payload],
  });

  return query;
};

export default useGetApprovalStatusList;
