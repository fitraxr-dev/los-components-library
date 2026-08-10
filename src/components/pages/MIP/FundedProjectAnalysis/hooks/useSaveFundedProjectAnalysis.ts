import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AnalysisFundedProjectControllerApi } from '@/services/openapi/mip-service';


const api = new AnalysisFundedProjectControllerApi();

const useSaveFundedProjectAnalysis = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, bucketProcessId, description, process, module }: SaveDto) => {
      const res = await api.saveExecutiveSummary1(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mip-funded-project-analysis', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  id: number;
  bucketProcessId: string;
  description: any;
  module: string;
  process: string;
}

export default useSaveFundedProjectAnalysis;
