import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface DeleteSyariahFacilityPayload {
  id: number;
}

const useDeleteSyariahFacility = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DeleteSyariahFacilityPayload) => {
      const res = await API('bucket.facilitySyariah.delete', { data: payload });
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syariah-facility-list']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteSyariahFacility;
