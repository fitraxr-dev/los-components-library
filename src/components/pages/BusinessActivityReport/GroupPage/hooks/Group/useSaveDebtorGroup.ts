import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GroupControllerApi } from '@/services/openapi/master-service';

import type { SaveDebtorGroupRequestDto } from '@/services/openapi/master-service';


const api = new GroupControllerApi();

const useSaveDebitorGroup = ({
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveDebtorGroupRequestDto) => {
      const res = await api.saveDebtorGroup(payload);

      return res.data;
    },
    onError: (data) => onError(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group']});
      onSuccess(data);},
  });

  return mutation;
};

export default useSaveDebitorGroup;
