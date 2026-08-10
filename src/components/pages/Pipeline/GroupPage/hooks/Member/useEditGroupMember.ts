import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GroupControllerApi } from '@/services/openapi/master-service';

import type { AddMemberDebtorGroupRequestDto } from '@/services/openapi/master-service';


const api = new GroupControllerApi();

const useEditGroupMember = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: AddMemberDebtorGroupRequestDto) => {
      const res = await api.editMemberGroupDebtor(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['group-list']});
      queryClient.invalidateQueries({ queryKey: ['debtor-group']});
      queryClient.invalidateQueries({ queryKey: ['list-group-member']});
    },
  });

  return mutation;
};

export default useEditGroupMember;
