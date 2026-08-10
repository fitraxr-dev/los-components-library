import { API } from '@/helpers/api';

// Types for API requests and responses
export interface CheckExistingChangeRequestRequest {
  module: string;
}

export interface CheckExistingChangeRequestResponse {
  hasExisting: boolean;
  bucketProcessId?: string;
  data?: {
    hasExisting: boolean;
    bucketProcessId?: string;
  };
}


// API functions
export const checkExistingChangeRequest = async (
  request: CheckExistingChangeRequestRequest
): Promise<CheckExistingChangeRequestResponse> => {
  const response = await API('parameter.parameterBC.submission', { data: request });
  return response.data;
};


// Business Summary types and functions
export interface BusinessSummaryRequest {
  filter: {
    bucketProcessId: string;
    module: string;
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
}

export interface BusinessSummaryResponse {
  data: {
    page: {
      totalItems: number;
      totalPage: number;
    };
    contents: Array<{
      id: string;
      kodeBusinessSummary: string;
      label: string;
      active: string;
      modifiedBy: string;
      lastModified: string;
    }>;
  };
  message: string;
  status: string;
}

export const getBusinessSummary = async (request: BusinessSummaryRequest): Promise<BusinessSummaryResponse> => {
  try {
    const response = await API('parameter.parameterVA.businessSummary', { data: request });
    return response.data;
  } catch (error) {
    throw error;
  }
};
