import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FinancingAnalysisControllerApi } from '@/services/openapi/mip-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  bucketProcessId: string;
  description: any;
  module: TypeModule;
  process: TypeProcess;
}

const api = new FinancingAnalysisControllerApi();

const useSaveFinancingAnalysis = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, description, module, process }: SaveDto) => {
      const res = await api.saveFinancingAnalysis(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mip-financing-analysis', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveFinancingAnalysis;
