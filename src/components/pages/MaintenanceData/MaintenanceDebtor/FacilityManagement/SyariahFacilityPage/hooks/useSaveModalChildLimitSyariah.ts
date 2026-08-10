import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UseSaveChildLimitModalOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const useSaveModalChildLimitSyariah = (options?: UseSaveChildLimitModalOptions) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('master.facilityManagementSyariahProposed.saveModalChildLimit', { data: payload });
      return res.data ?? {};
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });

  return mutation;
};

export default useSaveModalChildLimitSyariah;
