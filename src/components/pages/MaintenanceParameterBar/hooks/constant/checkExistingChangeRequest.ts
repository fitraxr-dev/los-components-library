import { API } from '@/helpers/api';
import parameter from '@/services/endpoint/parameter';


export interface CheckExistingChangeRequestRequest {
  module: string;
}

export interface CheckExistingChangeRequestResponse {
  bucketProcessId?: string;
  hasExisting: boolean;
  message?: string;
}

/**
 * Check existing change request for parameter business call
 */
export const checkExistingChangeRequest = async (
  payload: CheckExistingChangeRequestRequest
): Promise<any> => {
  try {
    const response = await API('parameter.parameterBar.checkExistingChangeRequest', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};
