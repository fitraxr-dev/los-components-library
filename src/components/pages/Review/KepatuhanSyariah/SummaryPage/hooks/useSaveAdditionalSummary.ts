import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdditionalInformationControllerApi } from '@/services/openapi/mip-service';


const api = new AdditionalInformationControllerApi();

interface saveSummaryDto {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
  disclaimer?: string;
}

const useSaveAdditionalSummary = (options: {
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
      disclaimer,
    }: saveSummaryDto) => {
      const res = await api.saveAdditionalInformation(
        bucketProcessId,
        process,
        module,
        description,
        disclaimer
      );
      return res.data;
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['additional-summary', { bucketProcessId: variables.bucketProcessId }],
      });
      queryClient.invalidateQueries({
        queryKey: ['bucket-stepper', { bucketProcessId: variables.bucketProcessId }],
      });
      options.onSuccess?.(data, variables);
    },
  });

  return mutation;
};

export default useSaveAdditionalSummary;
