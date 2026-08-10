import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface PayloadInterface {
  facilityId: string;
  bucketProcessId?: string;
}

const useGetParentLimit = (payload: PayloadInterface) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.facilityManagementSyariahExisiting.limitInduk', {
        data: payload,
      });

      return res?.data;
    },
    queryKey: ['syariah-parent-limit', payload],
    select: (data) => data.data,
  });

  return query;
};
export default useGetParentLimit;
