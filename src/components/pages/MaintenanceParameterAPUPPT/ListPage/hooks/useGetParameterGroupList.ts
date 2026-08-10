import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface ParameterGroupListRequest {
  filter: {
    startLastModifiedDate?: string;
    endLastModifiedDate?: string;
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
  sortList?: {
    columnName: string;
    sortType: string;
  };
}

export interface ParameterGroupListResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: {
    contents: Array<{
      id: number;
      groupName: string;
      modifiedBy: string;
      modifiedDate: string;
      isEditable: boolean;
    }>;
    page: {
      noPage: number;
      itemPerPage: number;
      totalPage: number;
      totalData: number;
    };
    sortList: {
      key: string;
      value: string;
    };
  };
}

const getParameterGroupList = async (payload: ParameterGroupListRequest): Promise<ParameterGroupListResponse> => {
  try {
    const response = await API('parameter.parameterApuPpt.list', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const useGetParameterGroupList = (payload: ParameterGroupListRequest) => {
  const query = useQuery<ParameterGroupListResponse>({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return await getParameterGroupList(payload);
    },
    queryKey: ['parameter-group-budd-list', payload],
  });

  return query;
};

export default useGetParameterGroupList;
