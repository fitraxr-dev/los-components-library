import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { GroupControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketResponseDtoDebtorGroupDto,
  BaseResponseGenericBucketResponseDtoDebtorGroupDto,
  GenericBucketRequestDtoGetBucketDebtorGroupMappingRequestDto,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new GroupControllerApi();

const useGetGroupList = (
  payload: GenericBucketRequestDtoGetBucketDebtorGroupMappingRequestDto,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<GenericBucketResponseDtoDebtorGroupDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBucketDebtorGroupMapping(payload);

      return res.data;
    },
    queryKey: ['analysts', payload],
    select: (res: BaseResponseGenericBucketResponseDtoDebtorGroupDto) => res?.data,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetGroupList;
