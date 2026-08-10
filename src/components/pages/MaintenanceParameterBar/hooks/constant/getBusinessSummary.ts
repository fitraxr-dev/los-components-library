import { API } from '@/helpers/api';


export interface BusinessSummaryRequest {
  filter: {
    module: string;
    bucketProcessId: string;
    [key: string]: any; // Allow additional filter properties
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
  searchDetail?: {
    key: string;
    value: string;
  };
  sortList?: {
    columnName: string;
    sortType: 'asc' | 'desc';
  };
}

export interface BusinessSummaryResponse {
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

const getBusinessSummary = async (payload: BusinessSummaryRequest): Promise<BusinessSummaryResponse> => {
  try {
    const response = await API('parameter.parameterBar.processList', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getBusinessSummary;
