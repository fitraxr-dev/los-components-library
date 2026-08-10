import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveCreditCheckingExternal = ({
  onSuccess = (_data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Saving credit checking external with payload:', payload);

        const res = await API('mip.creditChecking.save', {
          data: payload,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('API response (saveCreditCheckingExternal):', res);

        return res?.data ?? null;
      } catch (error) {
        console.error('API error (saveCreditCheckingExternal):', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['external-rating']});
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useSaveCreditCheckingExternal;
