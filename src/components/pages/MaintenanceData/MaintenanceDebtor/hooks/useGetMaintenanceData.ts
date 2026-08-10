import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type {
  BaseResponseGenericBucketResponseDtoDebtorListResponseDto,
  GenericBucketRequestDtoDebtorFilterRequestDto,
  GenericBucketResponseDtoDebtorListResponseDto,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DebtorV2ControllerApi();

const useGetMaintenanceList = (
  payload: GenericBucketRequestDtoDebtorFilterRequestDto,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<GenericBucketResponseDtoDebtorListResponseDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAllDebtor(payload);

      return res.data;
    },
    queryKey: [
      'debtors',
      {
        filter: payload.filter,
        page: payload.page,
        searchDetail: payload.searchDetail,
        sortList: payload.sortList,
      }
    ],
    select: (res: BaseResponseGenericBucketResponseDtoDebtorListResponseDto) => res.data,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetMaintenanceList;
