import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface PayloadInterface {
  facilityId: string;
  bucketProcessId?: string;
}

const useGetSyariahDataDeltaChild = (payload: PayloadInterface, options?: any) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.facilityManagementSyariahProposed.dataDeltaChildLimit',
        { data: payload }
      );
      return res?.data;
    },
    queryKey: ['syariah-usulan-data-delta-child', payload],
    select: (data: any) => data.data,
    ...options,
  });

  return query;
};
export default useGetSyariahDataDeltaChild;
