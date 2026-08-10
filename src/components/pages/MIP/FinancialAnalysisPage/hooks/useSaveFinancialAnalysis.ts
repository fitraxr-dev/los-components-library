import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FinancialAnalysisControllerApi } from '@/services/openapi/mip-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {

  bucketProcessId: string;
  description: any;
  module: TypeModule;
  process: TypeProcess;

}

const api = new FinancialAnalysisControllerApi();

const useSaveFinancialAnalysis = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, description, process, module }: SaveDto) => {
      const res = await api.saveFinancialAnalysis(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mip-financial-analysis', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveFinancialAnalysis;
