import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


type Payload = {
  bucketProcessId: string;
  code: string;
  isUpdate: boolean;
  module: string;
  process: string;
}

const useSaveConfirmation = ({
  onError = () => {},
  onSuccess = () => {},
}: { onError?: () => void; onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: Payload) => {
      const res = await API('lpa.dpopRequest.businessSave', {
        data: payload,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpa-confirmation-difference']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveConfirmation;
