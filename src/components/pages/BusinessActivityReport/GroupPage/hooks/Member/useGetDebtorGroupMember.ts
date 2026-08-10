import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { GroupControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoGetAllMemberDebtorGroupRequestDto } from '@/services/openapi/master-service';


const api = new GroupControllerApi();

const useGetDebtorGroupMember = (payload: GenericBucketRequestDtoGetAllMemberDebtorGroupRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAllMemberGroupDebtor(payload);

      return res.data.data;
    },
    queryKey: ['list-group-member'],
  });

  return query;
};

export default useGetDebtorGroupMember;
