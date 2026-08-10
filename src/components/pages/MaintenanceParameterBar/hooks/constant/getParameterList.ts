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
      code: string;
      name: string;
      value: string;
      description?: string;
      module: string;
      isActive: boolean;
      isEditable?: boolean;
      bucketProcessId?: string;
      subModule?: string;
      createdAt: string;
      updatedAt: string;
      modifiedBy?: string;
      modifiedDate?: string;
    }>;
  };
  message: string;
  status: string;
}

const getParameterList = async (payload: ParameterListRequest): Promise<ParameterListResponse> => {
  try {
    const response = await API('parameter.parameterBar.parameterList', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getParameterList;
