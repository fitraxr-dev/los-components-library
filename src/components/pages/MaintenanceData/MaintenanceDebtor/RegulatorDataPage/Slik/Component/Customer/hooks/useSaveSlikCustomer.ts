import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveSlikCustomer = ({
  onSuccess = () => { },
  onError = (error: any) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('master.regulatorData.saveSlikCustomer', { data: payload });

      return res.data;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['maintenance-slik-customer-detail']});
    },
  });

  return mutation;
};


export default useSaveSlikCustomer;
