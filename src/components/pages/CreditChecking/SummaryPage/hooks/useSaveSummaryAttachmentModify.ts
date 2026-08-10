import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SummaryControllerApi } from '@/services/openapi/credit-checking-service';

import type { SummaryAttachmentRequestDto } from '@/services/openapi/credit-checking-service';


const api = new SummaryControllerApi();

const useSaveSummaryAttachmentModify = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SummaryAttachmentRequestDto) => {
      const res = await api.submitSummaryAttachmentModify(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list-summary-attachment']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveSummaryAttachmentModify;
