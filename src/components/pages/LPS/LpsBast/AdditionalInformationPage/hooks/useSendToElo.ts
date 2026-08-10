import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


type SaveDto = {
  bucketProcessId: string;
  module: string;
  process: string;
}

const useSendToElo = ({
  onSuccess = (data: any) => {},
  onError = (error: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      {
        bucketProcessId,
        module,
        process,
      }: SaveDto) => {
      const res = await API('bucketDocument.document.sendToElo', {
        data: {
          bucketProcessId,
          module,
          process,
        },
      }
      );

      return res.data;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({ queryKey: ['additional-info-bast-bisnis']});
      queryClient.invalidateQueries({ queryKey: ['additional-info-bast-bisnis', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess(data);
    },
  });

  return mutation;
};
export default useSendToElo;
