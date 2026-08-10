import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ManagementControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByIdDtoLong } from '@/services/openapi/loan-service';


const api = new ManagementControllerApi();

const useDeleteManagement = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload, debtorId }: deleteManagementProp) => {
      const res = await api.deleteManagementById({ id: payload.id });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['managements']});
    },
  });

  return mutation;
};

type deleteManagementProp = {
  payload: RequestByIdDtoLong;
  debtorId: string;
}

export default useDeleteManagement;
