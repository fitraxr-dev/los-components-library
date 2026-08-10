import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface SaveParameterGroupSubItemRequest{
  groupItemId?: number | null;
  bucketProcessId: string;
  noSubItem: string | number;
  subItem: string;
  isActive: boolean;
  referenceSubItem: string | null;
  needConfirmation: boolean;
  additionalAction: boolean;
}
export interface SaveParameterGroupSubItemResponse {
  content: {
    id: number;
    bucketProcessId: string;
    code: string | null;
    noSubItem: number;
    isActive: boolean;
    referenceSubItem: string | null;
    needConfirmation: boolean;
    additionalAction: boolean;
    subItem: string;
    createdDate: string;
    createdBy: string;
    modifiedBy: string;
    modifiedDate: string;
    status: string | null;
    statusLabel: string | null;
  };
}
type UseSaveParameterGroupSubItemProps =
  UseMutationOptions<SaveParameterGroupSubItemResponse, Error, SaveParameterGroupSubItemRequest>

const useSaveParameterGroupSubItem = ({ onSuccess, ...queryOptions }: UseSaveParameterGroupSubItemProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveParameterGroupSubItemRequest) => {
      const res = await API('parameter.parameterGroup.subItemStore', {
        data: {
          ...payload,
          module: 'BENEFICIAL_OWNER',
        },
      });

      return res.data?.data;
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['parameter-group', 'sub-item']});
      onSuccess?.(data, variables, ctx);
    },
    ...queryOptions,
  });

  return mutation;
};

export default useSaveParameterGroupSubItem;
