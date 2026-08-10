import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { ONE_MINUTE } from '@/configs/constants';
import { GroupControllerApi } from '@/services/openapi/bucket-service';

import type { GroupRequestDto } from '@/services/openapi/bucket-service';


const api = new GroupControllerApi();

const useGetDebtorGroupById = (payload: GroupRequestDto) => {
  const query = useQuery({
    enabled: payload.debtorId !== undefined &&
    payload.debtorId !== null &&
    payload.debtorId !== '',
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.detailGroupFromPipeline(payload);

      return res.data;
    },
    queryKey: ['debtor-group', {
      debtorId: payload.debtorId,
      groupCode: payload.groupCode,
    }],
    select: (data) => data.data.content,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetDebtorGroupById;
