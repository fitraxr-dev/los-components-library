import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type { UpdateMemberGroupRequestDto } from '@/services/openapi/master-service';


const api = new GroupV2ControllerApi();

const useGetDebtorGroupMemberDetail = (payload: UpdateMemberGroupRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getGroupMaintenanceMember(payload);
      console.log('res: ', res);

      return res.data.data;
    },
    queryKey: ['group-member-detail'],
  });

  return query;
};

export default useGetDebtorGroupMemberDetail;
