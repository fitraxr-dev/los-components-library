import { useQuery } from '@tanstack/react-query';

import { GroupControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoGetBucketDebtorGroupRequestDto } from '@/services/openapi/master-service';


const api = new GroupControllerApi();

const useGetDebtorGroup = (payload: GenericBucketRequestDtoGetBucketDebtorGroupRequestDto) => {
  const query = useQuery({
    placeholderData: {
      contents: [],
      page: {},
    },
    queryFn: async () => {
      const response = await api.getBucketDebtorGroup(payload);

      return response.data.data;
    },
    queryKey: ['group-debtor-group', payload],
  });

  return query;
};

export default useGetDebtorGroup;
