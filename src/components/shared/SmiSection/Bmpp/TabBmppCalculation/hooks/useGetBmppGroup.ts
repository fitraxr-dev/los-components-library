import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { GroupControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoGetBucketDebtorGroupMappingRequestDto } from '@/services/openapi/master-service';


const api = new GroupControllerApi();

const useGetBmppGroup = (
  payload: GenericBucketRequestDtoGetBucketDebtorGroupMappingRequestDto,
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBucketDebtorGroupMapping(payload);

      return res.data.data;
    },
    queryKey: ['bmpp-group', payload],
  });

  return query;
};

export default useGetBmppGroup;
