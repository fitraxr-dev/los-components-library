import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { ONE_MINUTE } from '@/configs/constants';
import { GroupControllerApi } from '@/services/openapi/master-service';

import type { GetGroupByIdRequestDto } from '@/services/openapi/master-service';


const api = new GroupControllerApi();

const useGetDebtorGroupById = (payload: GetGroupByIdRequestDto) => {
  const query = useQuery({
    enabled: payload.debtorId !== undefined &&
    payload.debtorId !== null &&
    payload.debtorId !== '',
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDebtorGroupById(payload);

      return res.data;
    },
    queryKey: ['debtor-group', {
      debtorId: payload.debtorId,
      id: payload.groupId,
    }],
    select: (data) => data.data.content,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetDebtorGroupById;
