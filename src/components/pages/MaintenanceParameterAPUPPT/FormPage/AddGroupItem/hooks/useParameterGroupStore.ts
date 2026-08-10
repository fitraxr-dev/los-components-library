import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ParameterGroupStoreParams {
  module: string;
  bucketProcessId: string | null;
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

const useParameterGroupStore = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const mutation = useMutation({
    mutationFn: async (params: ParameterGroupStoreParams) => {
      const res = await API('parameter.parameterApuPpt.store', {
        data: params,
      });

      return res.data;
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });

  return mutation;
};

export default useParameterGroupStore;
