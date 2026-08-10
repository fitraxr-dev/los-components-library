import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ParameterSubmissionRequest {
  filter: {
    module: string;
    bucketProcessId?: string;
    startModifiedDate?: string;
    endModifiedDate?: string;
    status?: string[];
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

export interface ParameterSubmissionResponse {
  data: {
    contents: Array<{
      id: string;
      parameterName: string;
      status: string;
      submittedBy: string;
      submittedDate: string;
      approvedBy?: string;
      approvedDate?: string;
      remarks?: string;
      module: string;
      bucketProcessId: string;
    }>;
    page: {
      totalItems: number;
      totalPage: number;
      currentPage: number;
    };
  };
  message: string;
  status: string;
}

const getParameterSubmission = async (payload: ParameterSubmissionRequest): Promise<ParameterSubmissionResponse> => {
  try {
    const response = await API('parameter.parameterBar.parameterSubmission', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const useGetParameterSubmission = (
  payload: ParameterSubmissionRequest,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery<any>({
    enabled: !!payload.filter.module, // Only run query when module is provided
    queryFn: async () => {
      return await getParameterSubmission(payload);
    },
    queryKey: ['parameter-submission', payload],
    ...config,
  });

  return query;
};

export default useGetParameterSubmission;
