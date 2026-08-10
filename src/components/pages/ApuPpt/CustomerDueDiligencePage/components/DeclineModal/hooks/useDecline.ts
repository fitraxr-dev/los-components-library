import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProcessorControllerApi } from '@/services/openapi/processor-service';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';


const api = new ProcessorControllerApi();

const useDecline = ({
  onSuccess = (data) => {},
  onError = () => {},
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-list', {
        module: variables.module,
        process: variables.process,
      }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
        buckerProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      onSuccess(data);
    },
  });

  return mutation;
};

export default useDecline;
