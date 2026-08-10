import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveRequest = ({
  onError,
  onSuccess,
}: {
  onError: (error: any) => void;
  onSuccess: (data: any) => void;
}) => {
  const { isPending, mutate } = useMutation({
    mutationFn: async (params: any) => {
      const res = await API('bucket.reassignmentSku.save', {
        data: params,
      });

      return res.data?.data ?? {};
    },
    onError(error: any) {
      onError(error);
    },
    onSuccess: (data: any) => onSuccess(data),
  });

  return {
    isPending,
    mutate,
  };
};

export default useSaveRequest;
