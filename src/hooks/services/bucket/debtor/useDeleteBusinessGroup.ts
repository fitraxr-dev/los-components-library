import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useDeleteBusinessGroup = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Deleting business group with payload:', payload);
        const response = await API('bucket.debtor.deleteBusinessGroup', { data: payload });
        console.log('API response (deleteDebtorGroupSelected):', response);

        return response.data.data.content;
      } catch (error) {
        console.error('API error (deleteDebtorGroupSelected):', error);
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

export default useDeleteBusinessGroup;
