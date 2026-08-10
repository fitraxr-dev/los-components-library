import { useMutation, useQuery } from '@tanstack/react-query';

import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type { UpdateMemberGroupRequestDto } from '@/services/openapi/master-service';


const api = new GroupV2ControllerApi();

const useUpdateGroupMemberDetail = ({ onError = () => {},
  onSuccess = () => {},
}) => {
  const res = useMutation({
    mutationFn: async (payload: UpdateMemberGroupRequestDto) => {
      const req = api.updateGroupMaintenanceMember(payload);

      return req;
    },
    onError: () => {
      onError();
    },
    onSuccess(data, variables, context) {
      onSuccess();
    },
  });

  return res;
};


export default useUpdateGroupMemberDetail;
