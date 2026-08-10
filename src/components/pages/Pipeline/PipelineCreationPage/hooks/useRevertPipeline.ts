import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PipelineControllerApi } from '@/services/openapi/loan-service';

import type {
  BaseResponsePipelineActionsResponseDto,
  PipelineActionsRequestDto,
} from '@/services/openapi/loan-service';


const api = new PipelineControllerApi();

const useRevertPipeline = ({
  onSuccess = (res: BaseResponsePipelineActionsResponseDto) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: PipelineActionsRequestDto) => {
      const res = await api.revertSubmissionPipeline(payload);

      return res.data;
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

export default useRevertPipeline;
