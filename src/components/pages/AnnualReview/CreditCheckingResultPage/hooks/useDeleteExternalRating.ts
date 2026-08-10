import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface RequestByIdDtoLong {
  id: number;
}

const useDeleteExternalRating = ({
  onSuccess = (data: any) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await API('mip.externalRating.delete', {
        data: payload,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mip-credit-checking-external-rating-list']});
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useDeleteExternalRating;
