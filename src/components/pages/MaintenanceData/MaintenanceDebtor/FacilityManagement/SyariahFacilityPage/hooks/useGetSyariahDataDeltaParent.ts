import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface PayloadInterface {
  facilityId: string;
  bucketProcessId?: string;
}

const useGetSyariahDataDeltaParent = (payload: PayloadInterface, options?: any) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.facilityManagementSyariahProposed.dataDeltaParentLimit',
        { data: payload }
      );
      return res?.data;
    },
    queryKey: ['syariah-usulan-data-delta-parent', payload],
    select: (data: any) => data.data,
    ...options,
  });

  return query;
};
export default useGetSyariahDataDeltaParent;
