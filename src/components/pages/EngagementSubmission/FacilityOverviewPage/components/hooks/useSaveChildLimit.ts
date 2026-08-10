import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveChildLimit = ({
  onSuccess = (response: any) => { },
  onError = (error: any) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('bucket.facilitySyariah.saveChildLimit', { data: payload });

      return res.data;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: (response: any) => {
      onSuccess(response.data);
      queryClient.invalidateQueries({ queryKey: ['child-limit']});
    },
  });

  return mutation;
};


export default useSaveChildLimit;
