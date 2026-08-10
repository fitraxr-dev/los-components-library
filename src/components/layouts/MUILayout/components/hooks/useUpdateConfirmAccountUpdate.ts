import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UseUpdateConfirmAccountUpdate {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const useUpdateConfirmAccountUpdate = (options?: UseUpdateConfirmAccountUpdate) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('bucket.assignment.updateStatusConfirmation', { data: payload });
      return res.data ?? {};
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });

  return mutation;
};

export default useUpdateConfirmAccountUpdate;
