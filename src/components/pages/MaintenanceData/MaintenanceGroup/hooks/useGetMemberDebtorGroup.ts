import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoRequestByIdDtoString,
  GenericBucketResponseDtoMaintenanceGroupMemberList,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new GroupV2ControllerApi();

const useGetDebtorGroupMember = (
  payload: GenericBucketRequestDtoRequestByIdDtoString,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoMaintenanceGroupMemberList>>

) => {

  const query = useQuery({
    // placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.retrieveMember(payload);;

      return res?.data?.data;
    },

    queryKey: ['list-group-member-by-id', { payload }],
    ...config,
  });

  return query;

};

export default useGetDebtorGroupMember;
