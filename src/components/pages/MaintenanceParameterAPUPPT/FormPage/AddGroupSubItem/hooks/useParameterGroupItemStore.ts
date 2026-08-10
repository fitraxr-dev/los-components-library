import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ParameterGroupItemStoreParams {
  module: string;
  bucketProcessId: string;
  itemNo: string;
  code: string;
  isActive: boolean;
  referenceItem?: string | null;
  item: string;
  needConfirmation: boolean;
  additionalAction: boolean;
  subItemList?: Array<{
    itemNo: string;
    isActive: boolean;
    referenceSubItem?: string | null;
    subItem: string;
  }>;
}

const useParameterGroupItemStore = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const mutation = useMutation({
    mutationFn: async (params: ParameterGroupItemStoreParams) => {
      const res = await API('parameter.parameterApuPpt.itemStore', {
        data: params,
      });

      return res.data;
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });

  return mutation;
};

export default useParameterGroupItemStore;
