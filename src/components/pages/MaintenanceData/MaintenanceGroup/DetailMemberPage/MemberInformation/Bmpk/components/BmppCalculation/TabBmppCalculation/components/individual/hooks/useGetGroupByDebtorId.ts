import { useQuery } from '@tanstack/react-query';

import { GroupControllerApi } from '@/services/openapi/master-service';


const api = new GroupControllerApi();

const useGetGroupByDebtorId = (debtorId: string) => {
  return useQuery({
    enabled: !!debtorId,
    queryFn: async () => {
      const payload = {
        filter: {
          debtorId: debtorId,
        },
        page: {
          itemPerPage: 25,
          noPage: 1,
        },
      };

      const res = await api.getBucketDebtorGroupMapping(payload);
      return res?.data;
    },
    queryKey: ['get-group-by-debtor-id', debtorId],
  });
};

export default useGetGroupByDebtorId;
