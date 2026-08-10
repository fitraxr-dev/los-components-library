import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SummaryControllerApi } from '@/services/openapi/mip-service';


const api = new SummaryControllerApi();

interface saveSummaryDto {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
  options?: any;
}

const useSaveSummary = (options: {
  onSuccess?: (data: any, variables: any) => void;
  onError?: (error: any, variables: any) => void;
} = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      process,
      module,
      description,
      options }: saveSummaryDto) => {
      const res = await api.saveSummary(
        bucketProcessId,
        process,
        module,
        description,
        options,
      );
      return res.data;
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: variables.bucketProcessId }]});
      queryClient.invalidateQueries({ queryKey: ['get-summary', { bucketProcessId: variables.bucketProcessId }]});
      options.onSuccess?.(data, variables);
    },
  });

  return mutation;
};

export default useSaveSummary;
