import { API } from '@/helpers/api';


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
 * Get process detail for parameter APU PPT
 */
export const getProcessDetail = async (
  payload: GetProcessDetailRequest
): Promise<GetProcessDetailResponse> => {
  try {
    const response = await API('parameter.paramApuPpt.processDetail', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};
