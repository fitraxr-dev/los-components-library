import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UpdateAcknowledgeDto {
  bucketProcessId: string;
  module: string;
  process: string;
  code: string;
}

const useUpdateAcknowledge = ({
  onSuccess = () => {},
  onError = () => {},
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  const mutation = useMutation({
    mutationFn: async (payload: UpdateAcknowledgeDto) => {
      const res = await API('lpa.dpopRequest.updateAcknowledge', {
        data: payload,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};

export default useUpdateAcknowledge;
export type { UpdateAcknowledgeDto };
