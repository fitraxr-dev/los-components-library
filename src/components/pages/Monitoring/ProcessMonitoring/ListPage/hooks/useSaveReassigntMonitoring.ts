import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveReassigntMonitoring = ({
  onError,
  onSuccess,
}: {
  onError: (error: any) => void;
  onSuccess: (data: any) => void;
}) => {
  const { isPending, mutate } = useMutation({
    mutationFn: async (payload: any) => {
      if (!payload) {
        throw new Error('Payload is required');
      }

      const res = await API('bucket.bucketList.reassignMonitoring', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    onError(error: any) {
      console.error('Reassign monitoring error:', error);
      onError(error);
    },
    onSuccess: (data: any) => {
      console.log('Reassign monitoring success:', data);
      onSuccess(data);
    },
  });

  return {
    isPending,
    mutate,
  };
};

export default useSaveReassigntMonitoring;
