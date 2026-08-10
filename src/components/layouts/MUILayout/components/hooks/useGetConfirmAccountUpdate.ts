import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetConfirmAccountUpdate = (options?: { enabled?: boolean }) => {
  const query = useQuery({
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const res = await API('bucket.assignment.getConfirmAccountUpdate');
        return res?.data?.data;
      } catch (err) {
        console.error('API ERROR Confirmation Account:', err);
        throw err;
      }
    },
    queryKey: ['confirm-account-update'],
    refetchInterval: 5000,
  });

  return query;
};

export default useGetConfirmAccountUpdate;
