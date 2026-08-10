import { useMutation, useQueryClient } from '@tanstack/react-query';


import { GroupControllerApi } from '@/services/openapi/bucket-service';

import type { BaseResponseGenericListDtoGroupResponseDto, GroupRequestDto } from '@/services/openapi/bucket-service';


const api = new GroupControllerApi();

const useAddMemberGroup = ({
  onSuccess = (data: BaseResponseGenericListDtoGroupResponseDto) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: Array<GroupRequestDto>) => {
      const res = await api.addGroupMemberPipeline(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ['group']});
      queryClient.invalidateQueries({ queryKey: ['debtor-group']});
      queryClient.invalidateQueries({ queryKey: ['group-debitor']});
      queryClient.invalidateQueries({ queryKey: ['list-group-member']});
      queryClient.invalidateQueries({ queryKey: ['get-group-by-debtor-id']});
      queryClient.invalidateQueries({ queryKey: ['group-list']});
    },
  });


  return mutation;
};

export default useAddMemberGroup;
