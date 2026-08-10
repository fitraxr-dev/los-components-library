import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdditionalInformationControllerApi } from '@/services/openapi/mip-service';


const api = new AdditionalInformationControllerApi();


type SaveAdditionalInformation = {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
  disclaimer?: string;
}

const useSaveAdditionalInformation = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, process, module, description, disclaimer }: SaveAdditionalInformation) => {
      const res = await api.saveAdditionalInformation(bucketProcessId, process, module, description, disclaimer);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: variables.bucketProcessId }]});
      queryClient.invalidateQueries({ queryKey: ['additional-information', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        procesS: variables.process,
      }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveAdditionalInformation;
