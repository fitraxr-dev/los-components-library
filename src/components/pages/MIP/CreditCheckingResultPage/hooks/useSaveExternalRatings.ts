import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ExternalRatingControllerApi } from '@/services/openapi/mip-service';

import type { ExternalRatingRequestDto } from '@/services/openapi/mip-service';


const api = new ExternalRatingControllerApi();

const useSaveExternalRating = ({
  onSuccess = (data: any) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: ExternalRatingRequestDto) => {
      const res = await api.saveExternalRating(payload);

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

export default useSaveExternalRating;
