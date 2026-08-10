import { useMutation, useQueryClient } from '@tanstack/react-query';

import { VerificationSheetControllerApi } from '@/services/openapi/agreement-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  bucketProcessId: string;
  description: any;
  process: TypeProcess;
  module: TypeModule;
}

const api = new VerificationSheetControllerApi();

const useSaveVerificationSheet = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, process, module, description }: SaveDto) => {
      const res = await api.saveVerificationSheet(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['verification-sheet', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveVerificationSheet;
