import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface SaveParameterGroupItemRequest{
  id?: number | null;
  bucketProcessId: string;
  itemNo: string | number;
  item: string;
  isActive: boolean;
  referenceItem: string | null;
  needConfirmation: boolean;
  additionalAction: boolean;
}
export interface SaveParameterGroupItemResponse {
  content: {
    id: number;
    bucketProcessId: string;
    code: string | null;
    itemNo: number;
    isActive: boolean;
    referenceItem: string | null;
    needConfirmation: boolean;
    additionalAction: boolean;
    item: string;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    status: string | null;
    statusLabel: string | null;
  };
}
type UseSaveParameterGroupItemProps =
  UseMutationOptions<SaveParameterGroupItemResponse, Error, SaveParameterGroupItemRequest>

const useSaveParameterGroupItem = ({ onSuccess, ...queryOptions }: UseSaveParameterGroupItemProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveParameterGroupItemRequest) => {
      const res = await API('parameter.parameterGroup.itemStore', {
        data: {
          ...payload,
          module: 'BENEFICIAL_OWNER',
        },
      });

      return res.data?.data;
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['parameter-group', 'item']});
      onSuccess?.(data, variables, ctx);
    },
    ...queryOptions,
  });

  return mutation;
};

export default useSaveParameterGroupItem;
