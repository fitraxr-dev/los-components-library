import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveBusinessGroup = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Saving business group with payload:', payload);
        const response = await API('bucket.debtor.saveBusinessGroup', { data: payload });
        console.log('API response (saveDebtorGroupSelected):', response);

        return response.data?.data?.content ?? null;
      } catch (error) {
        console.error('API error (saveDebtorGroupSelected):', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['debtor-group-selected-list'],
      });

      onSuccess();
    },
  });

  return mutation;
};

export default useSaveBusinessGroup;
