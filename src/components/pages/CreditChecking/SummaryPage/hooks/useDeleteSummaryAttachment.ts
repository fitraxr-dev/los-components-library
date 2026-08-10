import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SummaryControllerApi } from '@/services/openapi/credit-checking-service';

import type { RequestByIdDtoLong } from '@/services/openapi/credit-checking-service';


const api = new SummaryControllerApi();

const useDeleteSummaryAttachment = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteSummaryAttachment(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['list-summary-attachment', variable]});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteSummaryAttachment;
