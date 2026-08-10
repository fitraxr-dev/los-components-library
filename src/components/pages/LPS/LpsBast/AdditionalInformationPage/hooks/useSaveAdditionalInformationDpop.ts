import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdditionalInformationLpsbdControllerApi } from '@/services/openapi/agreement-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  bucketProcessId: string;
  description: any;
  module: TypeModule;
  process: TypeProcess;
}

const api = new AdditionalInformationLpsbdControllerApi();

const useSaveAdditionalInformationDpop = ({
  onSuccess = () => {},
  onError = (error: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      {
        bucketProcessId,
        module,
        process,
        description,
      }: SaveDto) => {
      const res = await api.saveAdditionalInformationLpsbd(
        bucketProcessId,
        process,
        module,
        description
      );

      return res.data;
    },
    onError: (error: any) => {
      onError(error);
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['additional-info-dpop']});
      queryClient.invalidateQueries({ queryKey: ['additional-info-dpop', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveAdditionalInformationDpop;
