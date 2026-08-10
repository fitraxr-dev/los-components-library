import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface GetParameterGroupItemListRequest {
  bucketProcessId: string | null;
  page: number;
  pageSize: number;
}

interface ParameterGroupItem {
  id: string;
  itemNo: string;
  item: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  bucketProcessId: string;
}

interface GetParameterGroupItemListResponse {
  operationId?: string | null;
  errorCode?: string;
  errorDesc?: string;
  errorSource?: string;
  errorDetail?: string | null;
  timestamp?: string;
  data?: {
    contents?: ParameterGroupItem[];
    page?: {
      totalPage?: number;
      totalItem?: number;
      itemPerPage?: number;
      noPage?: number;
    };
  };
  [key: string]: any;
}

const useGetParameterGroupItemList = (
  bucketProcessId: string | null,
  page: number = 1,
  pageSize: number = 10,
  config?: Partial<UseQueryOptions<GetParameterGroupItemListResponse>>
) => {
  const query = useQuery<GetParameterGroupItemListResponse>({
    enabled: true, // Always enabled, let API handle null bucketProcessId
    queryFn: async () => {
      // Remove the bucketProcessId requirement check

      const payload = {
        bucketProcessId,
        page: {
          itemPerPage: pageSize,
          noPage: page,
        },
      };

      const response = await API('parameter.parameterGroupItemList', { data: payload });

      return response.data;
    },
    queryKey: ['parameter-group-item-list', bucketProcessId, page, pageSize],
    ...config,
  });

  return query;
};

export default useGetParameterGroupItemList;
