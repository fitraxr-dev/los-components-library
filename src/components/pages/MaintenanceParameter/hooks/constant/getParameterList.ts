import { API } from '@/helpers/api';


export interface ParameterListRequest {
  filter: {
    startModifiedDate?: string;
    endModifiedDate?: string;
    [key: string]: any;
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
  searchDetail: {
    key: string;
    value: string;
  };
  sortList: {
    columnName: string;
    sortType: 'asc' | 'desc';
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
      parameterName: string;
      parameterCode: string;
      parameterType: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      modifiedBy: string;
      modifiedDate: string;
      status?: string;
      bucketProcessId?: string;
    }>;
  };
  message: string;
  status: string;
}

const getParameterList = async (payload: ParameterListRequest): Promise<ParameterListResponse> => {
  try {
    const response = await API('parameter.parameterLov.list', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getParameterListSubmission = async (payload: ParameterListRequest): Promise<ParameterListResponse> => {
  try {
    const response = await API('parameter.parameterLov.submission', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getParameterList;
export { getParameterListSubmission };
