import { useQuery } from '@tanstack/react-query';

import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type { UpdateMemberGroupRequestDto } from '@/services/openapi/master-service';


const api = new GroupV2ControllerApi();

const useGetGroupMemberDetail = (payload: UpdateMemberGroupRequestDto) => {
  return useQuery({
    enabled: !!(payload?.debtorCode),
    queryFn: async () => {
      const res = await api.getGroupMaintenanceMember(payload);
      return res?.data;
    },
    queryKey: ['get-group-member-detail', payload],
  });
};

export default useGetGroupMemberDetail;
