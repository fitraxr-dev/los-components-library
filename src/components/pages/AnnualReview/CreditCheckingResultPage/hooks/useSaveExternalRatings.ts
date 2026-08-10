import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ExternalRatingRequestDto {
  id?: number;
  bucketProcessId?: string;
  process?: string;
  module?: string;
  ratingResult?: string;
  ratingDescription?: string;
}

const useSaveExternalRating = ({
  onSuccess = (data: any) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: ExternalRatingRequestDto) => {
      const res = await API('mip.externalRating.save', {
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

export default useSaveExternalRating;
