import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ConfirmationHistoryControllerApi, type ConfirmationHistoryRequestDto } from '@/services/openapi/mip-service';


const api = new ConfirmationHistoryControllerApi();

const useSaveConfirmationHistory = ({
  onError = () => { },
  onSuccess = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ConfirmationHistoryRequestDto) => {
      const res = await api.saveConfirmation(payload);
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confirmation-history-latests']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveConfirmationHistory;
