import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProcessorControllerApi, type SubmitRequestDto } from '@/services/openapi/processor-service';


const api = new ProcessorControllerApi();

const useSubmitAdditionalInformation = ({
  onSuccess = (_, variables: SubmitRequestDto) => {},
  onError = (_, variables: SubmitRequestDto) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SubmitRequestDto) => {
      const res = await api.submitBucketProcess(payload);

      return res.data;
    },
    onError: (_, variables) => {
      onError(_, variables);
    },
    onSuccess: (_, variables) => {
      onSuccess(_, variables);
      queryClient.invalidateQueries({ queryKey: ['bucket-list', {
        filter: {
          module: variables.module,
          process: variables.process,
        },
      }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
    },
  });

  return mutation;
};

export default useSubmitAdditionalInformation;
