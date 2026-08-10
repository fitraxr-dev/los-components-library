import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface ParameterGroupStoreParams {
  module: string;
  bucketProcessId: string;
  applicationType: string;
  noItemGroup: string;
  code: string;
  isActive: boolean;
  referenceGroup?: string | null;
  itemGroup: string;
  needConfirmation: boolean;
  additionalAction: boolean;
  itemList?: Array<{
    itemNo: string;
    isActive: boolean;
    referenceItem?: string | null;
    item: string;
    subItemList?: Array<{
      itemNo: string;
      isActive: boolean;
      referenceSubItem?: string | null;
      subItem: string;
    }>;
  }>;
}

interface ParameterGroupStoreResponse {
  operationId?: string | null;
  errorCode?: string;
  errorDesc?: string;
  errorSource?: string;
  errorDetail?: string | null;
  timestamp?: string;
  data?: {
    content?: {
      bucketProcessId?: string;
      id?: string;
    };
  };
  [key: string]: any;
}

const useParameterGroupStore = (options?: {
  onSuccess?: (data: ParameterGroupStoreResponse) => void;
  onError?: (error: any) => void;
}) => {
  const mutation = useMutation({
    mutationFn: async (params: ParameterGroupStoreParams) => {
      try {
        const response = await API('parameter.parameterGroupStore', { data: params });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });

  return mutation;
};

export default useParameterGroupStore;
