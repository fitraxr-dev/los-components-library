import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


type DeleteUserPayload = {
  id: number;
};

const useDeleteUser = ({
  onSuccess = () => {},
  onError = () => {},
}: {
  onSuccess?: () => void;
  onError?: (error?: any) => void;
} = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DeleteUserPayload) => {
      const res = await API('userManagement.user.delete', { data: payload });

      return res.data;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['um-user-list']});
    },
  });

  return mutation;
};

export default useDeleteUser;
