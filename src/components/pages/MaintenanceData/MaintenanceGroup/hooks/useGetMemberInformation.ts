import { useQuery } from '@tanstack/react-query';

import { GroupV2ControllerApi } from '@/services/openapi/master-service';


interface GetMemberInformationParams {
  bucketProcessId?: string;
  debtorCode: string;
  groupId: string;
}

const useGetMemberInformation = (params: GetMemberInformationParams) => {
  const { bucketProcessId, debtorCode, groupId } = params;

  return useQuery({
    enabled: !!debtorCode && !!groupId,
    queryFn: async () => {
      const api = new GroupV2ControllerApi();
      const payload: any = {
        debtorCode,
        groupId,
      };
      if (bucketProcessId) {
        payload.bucketProcessId = bucketProcessId;
      }
      const response = await api.getGroupMaintenanceMember(payload);
      return response.data;
    },
    queryKey: ['member-information', { bucketProcessId, debtorCode, groupId }],
  });
};

export default useGetMemberInformation;
