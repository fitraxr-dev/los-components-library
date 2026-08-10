import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveInterestConstruction = ({
  onSuccess = () => { },
  onError = (error: any) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('master.facilityConventional.interestConstructionsSave', { data: payload });

      return res.data;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['conventional-interest-constructions-detail']});
    },
  });

  return mutation;
};


export default useSaveInterestConstruction;
