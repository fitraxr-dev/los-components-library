import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { RequestByIdDtoLong } from '../FinancingOverview.type';


const useDeleteFinancingFacility = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await API('bucket.financialFacility.delete', {
        data: payload,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financing-facility-list']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-validate']});
      onSuccess();
    },
  });

  return mutation;
};


export default useDeleteFinancingFacility;
