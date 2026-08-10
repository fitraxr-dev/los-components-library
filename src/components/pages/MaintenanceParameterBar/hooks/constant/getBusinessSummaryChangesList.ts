import { API } from '@/helpers/api';


export interface BusinessSummaryChangesListRequest {
  filter: {
    module: string;
    bucketProcessId: string;
    action: string;
  };
  page: {
    itemPerPage: number;
    noPage: number;
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

const getBusinessSummaryChangesList = async (
  payload: BusinessSummaryChangesListRequest
): Promise<BusinessSummaryChangesListResponse> => {
  try {
    const response = await API('parameter.parameterBar.businessSummaryChangesList', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getBusinessSummaryChangesList;
