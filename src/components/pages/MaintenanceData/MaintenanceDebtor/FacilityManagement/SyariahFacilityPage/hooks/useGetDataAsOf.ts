import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface PayloadInterface {
  debtorId: string;
  parentFacilityId?: string;
}

const useGetDataAsOf = (payload: PayloadInterface) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.facilityManagementSyariahExisiting.dataAsOf', {
        data: payload,
      });

      return res?.data;
    },
    queryKey: ['syariah-data-as-of', payload],
    select: (data) => data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};
export default useGetDataAsOf;
