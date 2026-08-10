import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ExternalRatingControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new ExternalRatingControllerApi();

const useDeleteExternalRating = ({
  onSuccess = (data: any) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteExternalRating(payload);

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
