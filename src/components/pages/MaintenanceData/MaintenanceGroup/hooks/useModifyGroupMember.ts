import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type { AddGroupMemberRequest } from '@/services/openapi/master-service';


const api = new GroupV2ControllerApi();

const useModifyGroupMember = ({
  onError = (e) => { },
  onSuccess = (data, variables) => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: AddGroupMemberRequest) => {
      const response = await api.modifyMemberGroup(payload);
      return response?.data;
    },
    onError: (e) => {
      onError(e);
    },
    onSuccess: (data, variables) => {
      onSuccess(data, variables);
    },
  });

  return mutation;

};

export default useModifyGroupMember;
