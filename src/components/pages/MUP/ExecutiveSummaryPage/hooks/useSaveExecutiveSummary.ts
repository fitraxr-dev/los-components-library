import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ExecutiveSummaryControllerApi } from '@/services/openapi/mip-service';


const api = new ExecutiveSummaryControllerApi();

const useSaveExecutiveSummary = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, bucketProcessId, description, process, module, financingType }: SaveDto) => {
      const res = await api.saveExecutiveSummary(bucketProcessId, process, module, description, financingType);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mip-funded-executive-summary', { bucketProcessId: variable.bucketProcessId }]});
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
  financingType: string;
}

export default useSaveExecutiveSummary;
