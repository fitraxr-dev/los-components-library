import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ConclusionControllerApi } from '@/services/openapi/mip-service';


const api = new ConclusionControllerApi();

type SaveConclusionPayload = {
  bucketProcessId: string;
  process: string;
  module: string;
  summaryHighRisk?: boolean;
  description?: any;
}

const useSaveConclusion = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, process, module, summaryHighRisk, description }: SaveConclusionPayload) => {
      const res = await api.saveConclusion(bucketProcessId, process, module, summaryHighRisk, description);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conclusion', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveConclusion;
