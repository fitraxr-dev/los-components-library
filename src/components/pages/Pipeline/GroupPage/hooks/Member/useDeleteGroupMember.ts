import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GroupControllerApi } from '@/services/openapi/bucket-service';

import type { GroupRequestDto } from '@/services/openapi/bucket-service';


const api = new GroupControllerApi();

const useDeleteGroupMember = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: GroupRequestDto) => {
      const res = await api.deleteGroupMemberPipeline(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group-list']});
      queryClient.invalidateQueries({ queryKey: ['group-member', { id: variables.groupCode }]});
      queryClient.invalidateQueries({ queryKey: ['debtor-group']});
      queryClient.invalidateQueries({ queryKey: ['list-group-member']});

      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteGroupMember;
