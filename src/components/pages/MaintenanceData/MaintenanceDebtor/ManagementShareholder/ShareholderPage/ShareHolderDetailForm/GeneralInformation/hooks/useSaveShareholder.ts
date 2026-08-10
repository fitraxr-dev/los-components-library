import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveShareholder = ({
  onSuccess = () => { },
  onError = (error?: any) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {

      const res = await API('master.shareholder.saveShareholder', {
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['shareholders-list']});
    },
  });

  return mutation;
};

export default useSaveShareholder;
