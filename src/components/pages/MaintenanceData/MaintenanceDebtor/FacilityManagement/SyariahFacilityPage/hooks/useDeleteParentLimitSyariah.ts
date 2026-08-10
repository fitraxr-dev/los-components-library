import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


type RequestByIdDtoLong = {
  syariahLimitId?: number;
};

const useDeleteParentLimitSyariah = ({
  onSuccess = (variables: any) => {},
  onErrorr = (error: any) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await API('master.facilityManagementSyariahProposed.deleteParentLimit', {
        data: payload,
      });
      return res.data ?? {};
    },
    onError: (error) => {
      onErrorr(error);
    },
    onSuccess: (_, variables) => {
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useDeleteParentLimitSyariah;
