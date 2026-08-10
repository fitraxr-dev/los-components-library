import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UseSaveChildLimitOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const useSaveChildLimitSyariah = (options?: UseSaveChildLimitOptions) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('master.facilityManagementSyariahProposed.updateChildLimit', { data: payload });
      return res.data ?? {};
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });

  return mutation;
};

export default useSaveChildLimitSyariah;
