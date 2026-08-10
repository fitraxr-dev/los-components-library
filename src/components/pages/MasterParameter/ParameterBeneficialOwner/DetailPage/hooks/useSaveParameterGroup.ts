import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface SaveParameterGroupRequest{
  id?: number;
  additionalAction?: boolean;
  applicationType?: string;
  bucketProcessId?: string;
  code?: string;
  isActive?: boolean;
  itemGroup?: string;
  needConfirmation?: boolean;
  noItemGroup?: string;
  referenceGroup?: string;
}
export interface SaveParameterGroupResponse {
  content: {
    id: number;
    bucketProcessId: string;
    applicationType: string;
    applicationTypeKey: string;
    code: string | null;
    itemNo: number;
    isActive: boolean;
    needConfirmation: boolean;
    additionalAction: boolean;
    referenceGroup: string | null;
    itemGroup: string;
    isEditable: boolean;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    status: string | null;
    statusLabel: string | null;
  };
}
type UseSaveParameterGroupDetailProps =
  UseMutationOptions<SaveParameterGroupResponse, Error, SaveParameterGroupRequest>

const useSaveParameterGroupDetail = ({ onSuccess, ...queryOptions }: UseSaveParameterGroupDetailProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveParameterGroupRequest) => {
      const res = await API('parameter.parameterGroup.store', {
        data: {
          ...payload,
          module: 'BENEFICIAL_OWNER',
        },
      });

      return res.data?.data;
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['parameter-group', 'list']});
      onSuccess?.(data, variables, ctx);
    },
    ...queryOptions,
  });

  return mutation;
};

export default useSaveParameterGroupDetail;
