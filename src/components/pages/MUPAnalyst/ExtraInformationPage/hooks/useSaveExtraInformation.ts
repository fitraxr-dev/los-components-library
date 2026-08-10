import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ExtraInformationControllerApi } from '@/services/openapi/mip-service';


type SaveExtraInformationProps = {
  bucketProcessId: string;
  process: string;
  module: string;
  disclaimer?: string;
  description?: Blob;
}

const api = new ExtraInformationControllerApi();

const useSaveExtraInformation = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, process, module, disclaimer, description }: SaveExtraInformationProps) => {
      const res = await api.saveExtraInformation(bucketProcessId, process, module, disclaimer, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['extra-information-detail', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-list', {
        filter: {
          module: variables.module,
          process: variables.process,
        },
      }]});
    },
  });
  return mutation;
};

export default useSaveExtraInformation;
