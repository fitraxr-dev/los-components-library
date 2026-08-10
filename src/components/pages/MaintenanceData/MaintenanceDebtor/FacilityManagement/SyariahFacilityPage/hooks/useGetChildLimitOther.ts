import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface PayloadInterface {
  facilityId: string;
  bucketProcessId?: string;
}

const useGetChildLimitOther = (payload: PayloadInterface) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.facilityManagementSyariahExisiting.other', {
        data: payload,
      });

      return res?.data;
    },
    queryKey: ['syariah-child-limit-other', payload],
    select: (data) => data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};
export default useGetChildLimitOther;
