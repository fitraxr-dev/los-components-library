import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { GroupControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoGetBucketDebtorGroupMappingRequestDto,
  GenericBucketResponseDtoDebtorGroupDto,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new GroupControllerApi();

const useGetBusinessGroupMasterList = (
  payload: GenericBucketRequestDtoGetBucketDebtorGroupMappingRequestDto,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoDebtorGroupDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBucketDebtorGroupMapping(payload);

      return res.data.data;
    },
    queryKey: ['credit-checking-business-group-master-list', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetBusinessGroupMasterList;
