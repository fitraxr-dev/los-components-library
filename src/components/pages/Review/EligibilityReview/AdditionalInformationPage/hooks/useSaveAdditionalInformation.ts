import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdditionalInformationControllerApi } from '@/services/openapi/mip-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  bucketProcessId: string;
  description: any;
  module: TypeModule;
  process: TypeProcess;
  disclaimer?: string;
}

const api = new AdditionalInformationControllerApi();

const useSaveAdditionalInformation = (options: {
  onSuccess?: (data: any, variables: any) => void;
  onError?: (error: any, variables: any) => void;
} = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      module,
      process,
      description,
      disclaimer,
    }: SaveDto) => {
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
        queryKey: ['reviewer-depi-step', { bucketProcessId: variables.bucketProcessId }],
      });
      queryClient.invalidateQueries({
        queryKey: ['reviewer-depi-additional-information', { bucketProcessId: variables.bucketProcessId }],
      });
      options.onSuccess?.(data, variables);
    },
  });

  return mutation;
};

export default useSaveAdditionalInformation;
