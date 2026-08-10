import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { GroupControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoGroupRequestDto } from '@/services/openapi/bucket-service';


const api = new GroupControllerApi();

const useGetDebtorGroupMember = (payload: GenericBucketRequestDtoGroupRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.listGroupMemberPipeline(payload);

      return res.data.data;
    },
    queryKey: ['list-group-member', { ...payload }],
    select(data) {
      return data;
    },
  });

  return query;
};

export default useGetDebtorGroupMember;
