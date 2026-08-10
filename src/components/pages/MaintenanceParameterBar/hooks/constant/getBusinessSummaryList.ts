import { API } from '@/helpers/api';


export interface BusinessSummaryRequest {
  filter: {
    module: string;
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
}

export const getBusinessSummaryList = async (payload: BusinessSummaryRequest): Promise<any> => {
  try {
    const response = await API('parameter.parameterBar.list', { data: payload });
    return response.data;
  } catch (error) {
    console.error('getBusinessSummaryList API error:', error);
    throw error;
  }
};
