import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProcessorControllerApi } from '@/services/openapi/processor-service';

import type { BaseResponseString, SubmitRequestDto } from '@/services/openapi/processor-service';


const api = new ProcessorControllerApi();

const useSubmitPipeline = ({
  onSuccess = (res: BaseResponseString) => {},
  onError = (_error?: any) => {},
}: {
  onSuccess?: (res: BaseResponseString) => void;
  onError?: (error?: any) => void;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SubmitRequestDto) => {
      const res = await api.submitBucketProcess(payload);

      return res.data;
    },
    onError: (error) => {
      onError(error as any);
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

export default useSubmitPipeline;
