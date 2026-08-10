import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useDeleteDataShareholder = ({
  onSuccess = (data: any) => {},
  onError = (error: any) => {},
}) => {

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {

        const response = await API('creditChecking.managementShareholder.delete', {
          data: payload,
        });
        return response?.data;
      } catch (error) {
        console.error('API error (delete):', error);
        throw error;
      }
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: (data) => {
      onSuccess(data);
    },
  });

  return mutation;
};

export default useDeleteDataShareholder;
