import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProcessorControllerApi } from '@/services/openapi/processor-service';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';


const api = new ProcessorControllerApi();

const useSubmitMaintenanceModal = ({
  onSuccess = (data?: any) => { },
  onError = () => { },
  invalidateOnSuccess = true,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SubmitRequestDto) => {
      const res = await api.submitBucketProcess(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      onSuccess(data);
      if (invalidateOnSuccess) {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
        queryClient.invalidateQueries({ queryKey: ['get-capital-detail']});
        queryClient.invalidateQueries({ queryKey: ['bucket-list']});
      }
    },
  });

  return mutation;
};

export default useSubmitMaintenanceModal;
