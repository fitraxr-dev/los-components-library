import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetParentLimitData = (options?: any) => {
  const mutation = useMutation<any, any, any>({
    mutationFn: async (payload: any) => {
      const res = await API('master.facilityManagementSyariahExisiting.getParentLimitData', { data: payload });
      return res?.data || [];
    },
    ...options,
  });

  return mutation;
};

export default useGetParentLimitData;
