import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoLong } from '@/services/openapi/master-service';


const api = new GroupV2ControllerApi();

const useRemoveGroupMember = ({
  onError = (error) => { },
  onSuccess = (data, variables) => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const response = await api.deleteMember(payload);
      return response?.data;
    },

    onError: (error) => {
      onError(error);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['get-group-detail-by-id', { id: variables.id }],
      });

      queryClient.invalidateQueries({
        queryKey: ['list-group-member-by-id'],
      });

      onSuccess(data, variables);
    },

  });

  return mutation;

};

export default useRemoveGroupMember;
