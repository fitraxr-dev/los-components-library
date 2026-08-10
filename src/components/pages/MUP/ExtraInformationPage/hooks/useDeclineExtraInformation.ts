import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProcessorControllerApi, type SubmitRequestDto } from '@/services/openapi/processor-service';


const api = new ProcessorControllerApi();

const useDeclineExtraInformation = ({
  onSuccess,
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
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ['bucket-list', {
        filter: {
          module: variables.module,
          process: variables.process,
        },
      }]});
    },
  });

  return mutation;
};

export default useDeclineExtraInformation;
