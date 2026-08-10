import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdditionalInformationControllerApi } from '@/services/openapi/mip-service';

// TODO
const api = new AdditionalInformationControllerApi();

const useSaveAdditionalInfo = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      process,
      module,
      description,
      disclaimer,
    }: SaveDto) => {
      // TODO
      const res = await api.saveAdditionalInformation(
        bucketProcessId,
        process,
        module,
        description,
        disclaimer,
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({
        queryKey: ['additional-info-detail',
          {
            bucketProcessId: variable.bucketProcessId,
            module: variable.module,
            process: variable.process,
          }],
      });
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: Blob;
  disclaimer?: string;
}

export default useSaveAdditionalInfo;
