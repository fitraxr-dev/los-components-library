import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AskForInfoControllerApi } from '@/services/openapi/technical-review-service';


export type SaveDto = {
  bucketProcess: string;
  notes: any;
  process: string;
  module: string;
}


const api = new AskForInfoControllerApi();

const useSaveNote = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcess, notes, process, module }: SaveDto) => {
      const res = await api.creationAskForInfo(bucketProcess, notes, process, module);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['technical-review-note']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveNote;
