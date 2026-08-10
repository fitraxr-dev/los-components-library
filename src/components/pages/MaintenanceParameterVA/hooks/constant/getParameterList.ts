import { API } from '@/helpers/api';


export interface ParameterListRequest {
  filter: {
    [key: string]: any;
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
  searchDetail: {
    [key: string]: any;
  };
  sortList: {
    [key: string]: any;
  };
}

export interface ParameterListResponse {
  data: {
    page: {
      totalItems: number;
      totalPage: number;
    };
    contents: Array<{
      id: string;
      bankName: string;
      vaType: string;
      customerType: string;
      vaNumber: string;
      customerName: string;
      currency?: string;
      isActive: boolean;
      isEditable?: boolean;
      bucketProcessId?: string;
      createdAt: string;
      updatedAt: string;
      modifiedBy: string;
      modifiedDate: string;
    }>;
  };
  message: string;
  status: string;
}

const getParameterList = async (payload: ParameterListRequest): Promise<ParameterListResponse> => {
  try {
    const response = await API('parameter.paramVa.list', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getParameterListSubmission = async (payload: ParameterListRequest): Promise<ParameterListResponse> => {
  try {
    const response = await API('parameter.paramVa.submission', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getParameterList;
export { getParameterListSubmission };
