import { useMutation, useQueryClient } from '@tanstack/react-query';


import { GroupControllerApi } from '@/services/openapi/master-service';

import type {
  AddMemberDebtorGroupRequestDto,
  BaseResponseGenericSingleDtoResponseByIdDtoLong,
} from '@/services/openapi/master-service';


const api = new GroupControllerApi();

const useAddGroupMember = ({
  onSuccess = (data: BaseResponseGenericSingleDtoResponseByIdDtoLong) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: AddMemberDebtorGroupRequestDto) => {
      const res = await api.addMemberGroupDebtor(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ['group']});
      queryClient.invalidateQueries({ queryKey: ['debtor-group']});
      queryClient.invalidateQueries({ queryKey: ['list-group-member']});
      queryClient.invalidateQueries({ queryKey: ['get-group-by-debtor-id']});
    },
  });


  return mutation;
};

export default useAddGroupMember;
