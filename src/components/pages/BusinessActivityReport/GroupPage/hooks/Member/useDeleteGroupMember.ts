import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GroupControllerApi } from '@/services/openapi/master-service';

import type { RemoveMemberDebtorGroupRequestDto } from '@/services/openapi/master-service';


const api = new GroupControllerApi();

const useDeleteGroupMember = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RemoveMemberDebtorGroupRequestDto) => {
      const res = await api.removeMemberGroupDebtor(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group-member', { id: variables.groupId }]});
      queryClient.invalidateQueries({ queryKey: ['debtor-group']});
      queryClient.invalidateQueries({ queryKey: ['list-group-member']});

      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteGroupMember;
