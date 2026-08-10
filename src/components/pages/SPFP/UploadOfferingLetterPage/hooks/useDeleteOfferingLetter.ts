import { useMutation, useQueryClient } from '@tanstack/react-query';

import { OfferingLetterControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByIdDtoString } from '@/services/openapi/agreement-service';


const api = new OfferingLetterControllerApi();

const useDeleteOfferingLetter = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoString) => {
      const res = await api.deleteOfferingLetter(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upload-offering-letter-list']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteOfferingLetter;
