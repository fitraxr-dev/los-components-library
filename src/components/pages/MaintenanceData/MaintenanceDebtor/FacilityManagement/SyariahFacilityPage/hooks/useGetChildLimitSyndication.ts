import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface PayloadInterface {
  bucketProcessId?: string;
  facilityId: string;
}

const useGetChildLimitSyndication = (payload: PayloadInterface) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.facilityManagementSyariahExisiting.syndication', {
        data: payload,
      });

      return res?.data;
    },
    queryKey: ['syariah-child-limit-syndication', payload],
    select: (data) => data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};
export default useGetChildLimitSyndication;
