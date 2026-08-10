import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { SpecialApprovalTypeControllerApi } from '@/services/openapi/mip-service';

import type { GenericBucketRequestDtoListSpecialApprovalTypeRequestDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new SpecialApprovalTypeControllerApi();

const useGetSpecialApproval = (
  payload: GenericBucketRequestDtoListSpecialApprovalTypeRequestDto,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListSpecialApprovalType(payload);

      return res.data;
    },
    queryKey: [
      'special-approval',
      {
        filter: payload.filter,
        page: payload.page,
        searchDetail: payload.searchDetail,
        sortList: payload.sortList,
      }
    ],
    select: (res: any) => res.data,
    ...config,
  });

  return query;
};

export default useGetSpecialApproval;
