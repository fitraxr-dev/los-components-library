import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RisalahRapatVerificationResultControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByIdDtoLong } from '@/services/openapi/agreement-service';


const api = new RisalahRapatVerificationResultControllerApi();

const useDeleteUserAssignedDivision = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteUserCollaboration(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ['division-user-list']});
      queryClient.invalidateQueries({
        queryKey: ['user-collaboration-list']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteUserAssignedDivision;
