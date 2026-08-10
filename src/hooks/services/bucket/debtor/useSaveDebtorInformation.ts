import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveDebtorInformation = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Saving debtor information with payload:', payload);
        const response = await API('bucket.debtor.save', { data: payload });
        console.log('API response (saveBucketDebtor):', response);

        return response.data;
      } catch (error) {
        console.error('API error (saveBucketDebtor):', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['debtor-detail']});

      onSuccess(data);
    },
  });

  return mutation;
};

export default useSaveDebtorInformation;
