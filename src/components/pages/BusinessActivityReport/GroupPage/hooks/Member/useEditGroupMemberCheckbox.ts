import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type { UpdateMemberGroupRequestDto } from '@/services/openapi/master-service';


const api = new GroupV2ControllerApi();

const useEditGroupMemberCheckbox = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: UpdateMemberGroupRequestDto) => {
      const res = await api.updateGroupMaintenanceMember(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['debtor-group']});
      queryClient.invalidateQueries({ queryKey: ['list-group-member']});
    },
  });

  return mutation;
};

export default useEditGroupMemberCheckbox;
