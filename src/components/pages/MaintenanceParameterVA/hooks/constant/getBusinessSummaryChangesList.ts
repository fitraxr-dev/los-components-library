import { API } from '@/helpers/api';


export interface BusinessSummaryChangesListRequest {
  filter: {
    bucketProcessId: string;
    action: string;
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
  searchDetail: {
    key: string;
    value: string;
  };
}

export interface BusinessSummaryChangesListResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: {
    page: {
      noPage: number;
      itemPerPage: number;
      totalPage: number;
      totalData: number;
    };
    contents: Array<{
      id: number;
      bucketProcessId: string;
      module: string;
      code: string;
      label: string;
      isActive: boolean;
      createdBy: string;
      modifiedBy: string;
      codeToReference: string | null;
      status: string;
      statusLabel: string;
      action: string;
      oldData: any | null;
      createdDate: string;
      modifiedDate: string;
    }>;
  };
}

export const getBusinessSummaryChangesList = async (
  payload: BusinessSummaryChangesListRequest
): Promise<any> => {
  try {
    const response = await API('parameter.paramVa.summaryChangesList', { data: payload });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
