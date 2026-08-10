import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UpdateSubItemPayload {
  id: number;
  groupItemId: number;
  noSubItem: string;
  bucketProcessId: string;
  isActive: boolean;
  referenceSubItem: string | null;
  subItem: string;
  needConfirmation: boolean;
  additionalAction: boolean;
}

const useUpdateParameterGroupSubItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: UpdateSubItemPayload) => {
      const res = await API('parameter.parameterApuPpt.itemSubStore', {
        data: payload,
      });

      return res.data;
    },
    onError: (error) => {
      console.error('Error updating sub item:', error);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['parameter-group-sub-items', variables.bucketProcessId],
      });

      queryClient.invalidateQueries({
        queryKey: ['parameter-group-sub-item-detail', variables.id, variables.bucketProcessId],
      });

      queryClient.invalidateQueries({
        queryKey: ['parameter-group-item-detail'],
      });
    },
  });

  return mutation;
};

export default useUpdateParameterGroupSubItem;
