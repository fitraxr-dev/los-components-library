import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProcessorControllerApi } from '@/services/openapi/processor-service';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';


const api = new ProcessorControllerApi();

const useProcessToMip = ({
  onSuccess = (res: string) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SubmitRequestDto) => {
      const res = await api.submitBucketProcess(payload);

      return res.data.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({ queryKey: ['pipelines']});
      queryClient.invalidateQueries({ queryKey: ['pipeline', { id: variable.bucketProcessId }]});

      queryClient.invalidateQueries({ queryKey: ['timeline', { id: variable.bucketProcessId }]});
      onSuccess(data);
    },
  });

  return mutation;
};

export default useProcessToMip;
