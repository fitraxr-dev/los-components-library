import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GroupControllerApi } from '@/services/openapi/bucket-service';

import type { GroupRequestDto } from '@/services/openapi/bucket-service';


const api = new GroupControllerApi();

const useSaveDebitorGroup = ({
  onSuccess,
  onError,
}) => {

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: GroupRequestDto) => {
      const res = await api.saveGroupPipeline(payload);

      return res.data;
    },
    onError: (data) => onError(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group-debtor']});
      queryClient.invalidateQueries({ queryKey: ['group-list']});
      onSuccess(data);},
  });

  return mutation;
};

export default useSaveDebitorGroup;
