import { useQuery } from '@tanstack/react-query';


import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoRequestByIdDtoString,
  GenericBucketResponseDtoMaintenanceGroupMemberList,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new GroupV2ControllerApi();


const useGetAllMemberById = (
  payload: GenericBucketRequestDtoRequestByIdDtoString,
  isSubmission: boolean,
  isEdit?: boolean,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoMaintenanceGroupMemberList>>
) => {
  return useQuery({
    queryFn: async () => {

      if (isSubmission || isEdit) {
        const submissionPayload: GenericBucketRequestDtoRequestByIdDtoString = {
          filter: {
            id: payload.filter?.id,
            ...(payload.filter as any),
          },
          page: payload.page,
          searchDetail: payload.searchDetail,
          sortList: payload.sortList?.columnName ? {
            columnName: payload.sortList.columnName === 'debtorId.debtorId' ? 'debtorId' : payload.sortList.columnName,
            sortType: payload.sortList.sortType,
          } : {},
        };
        const res = await api.retrieveMemberSubmission(submissionPayload);
        return res?.data;
      }
      const res = await api.retrieveMember(payload);
      return res?.data?.data;
    },

    queryKey: ['list-group-member-by-id', payload],
    ...config,
  });

};

export default useGetAllMemberById;
