import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UseSaveParentLimitOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const useSaveParentLimitSyariah = (options?: UseSaveParentLimitOptions) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('master.facilityManagementSyariahProposed.saveParentLimit', { data: payload });
      return res.data ?? {};
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });

  return mutation;
};

export default useSaveParentLimitSyariah;
