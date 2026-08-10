import { API } from '@/helpers/api';


export interface RegisterWorkflowRequest {
  id: number;
}

export interface RegisterWorkflowResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: {
    id: number;
    bucketProcessId: string;
    parameterName: string;
    parameterCode: string;
    parameterType: string;
    isActive: boolean;
    oldData: any | null;
    status: string;
    statusLabel: string;
    createdBy: string;
    modifiedBy: string;
    createdDate: string;
    modifiedDate: string;
    isEditable: boolean;
  };
}

export const registerWorkflow = async (request: RegisterWorkflowRequest): Promise<RegisterWorkflowResponse> => {
  try {
    const response = await API('parameter.parameterLov.registerWorkflow', { data: request });
    return response.data;
  } catch (error) {
    console.error('registerWorkflow - Error:', error);
    throw error;
  }
};
