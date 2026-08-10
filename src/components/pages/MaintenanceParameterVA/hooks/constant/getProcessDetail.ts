import { API } from '@/helpers/api';
import parameter from '@/services/endpoint/parameter';


export interface GetProcessDetailRequest {
  id: number;
  bucketProcessId: string;
}

export interface GetProcessDetailResponse {
  data: any;
  message?: string;
  success: boolean;
}

/**
 * Get process detail for parameter VA
 */
export const getProcessDetail = async (
  payload: GetProcessDetailRequest
): Promise<GetProcessDetailResponse> => {
  try {
    const response = await API('parameter.paramVa.processDetail', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};
