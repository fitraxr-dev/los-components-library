import { useQuery } from '@tanstack/react-query';

import { GroupControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoGetAllMemberDebtorGroupRequestDto } from '@/services/openapi/master-service';


const api = new GroupControllerApi();

const useGetGroupMembers = (payload: GenericBucketRequestDtoGetAllMemberDebtorGroupRequestDto) => {
  const query = useQuery({
    placeholderData: [],
    queryFn: async () => {
      const response = await api.getAllMemberGroupDebtor(payload);

      return response.data.data.contents;
    },
    queryKey: ['group-debtor-group', payload],
  });

  return query;
};

export default useGetGroupMembers;
