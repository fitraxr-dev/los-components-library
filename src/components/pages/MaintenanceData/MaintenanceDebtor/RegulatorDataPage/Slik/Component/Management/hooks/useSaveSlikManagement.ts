import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveSlikManagement = ({
  onSuccess = () => { },
  onError = (error: any) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('master.regulatorData.saveSlikManagement', { data: payload });

      return res.data;
    },
    onError: (error: any) => {
      onError(error);
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['maintenance-slik-management-detail']});
      queryClient.invalidateQueries({ queryKey: ['maintenance-slik-management-list']});
    },
  });

  return mutation;
};


export default useSaveSlikManagement;
