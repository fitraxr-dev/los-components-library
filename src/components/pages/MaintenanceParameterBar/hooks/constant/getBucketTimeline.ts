import { API } from '@/helpers/api';


export interface BucketTimelineRequest {
  page: {
    noPage: number;
    itemPerPage: number;
  };
  filter: {
    bucketProcessId: string;
    module: string;
    process: string;
  };
}

export interface BucketTimelineResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: {
    page: {
      noPage: number;
      itemPerPage: number;
      totalPage: number;
      totalData: number;
    };
    contents: Array<{
      id: number;
      bucketProcessId: string;
      module: string;
      process: string;
      status: string;
      statusLabel: string;
      action: string;
      actionLabel: string;
      comment: string | null;
      createdBy: string;
      createdDate: string;
      modifiedBy: string | null;
      modifiedDate: string | null;
    }>;
  };
}

const getBucketTimeline = async (payload: BucketTimelineRequest): Promise<any> => {
  try {
    const response = await API('parameter.parameterBar.validationList', { data: payload });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getBucketTimeline;
