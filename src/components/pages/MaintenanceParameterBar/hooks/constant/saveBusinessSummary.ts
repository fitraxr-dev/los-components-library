import { API } from '@/helpers/api';


export interface SaveBusinessSummaryRequest {
  bucketProcessId: string;
  bcModuleReference: string;
  businessSummaryItems: Array<{
    id: string | null;
    code: string;
    label: string;
    isActive: boolean;
  }>;
}

export interface SaveBusinessSummaryResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const saveBusinessSummary = async (
  payload: SaveBusinessSummaryRequest
): Promise<SaveBusinessSummaryResponse> => {
  try {
    const response = await API('parameter.parameterBar.processSave', { data: payload });
    return response.data;
  } catch (error) {
    console.error('saveBusinessSummary API error:', error);
    throw error;
  }
};
