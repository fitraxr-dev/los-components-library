import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type {
  GenericBucketRequestDtoRequestByProcessIdDtoString,
  GenericBucketResponseDtoDebtorGroupSelectedResponseDto,
} from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ApplicationDebtorControllerApi();

const useGetBusinessGroupSelected = (
  payload: GenericBucketRequestDtoRequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoDebtorGroupSelectedResponseDto>>,
) => {
  const query = useQuery({
    enabled: payload !== undefined && payload !== null,
    queryFn: async () => {

      const res = await api.getListDebtorGroupSelected(payload);
      return res.data.data;
    },
    queryKey: ['debtor-group-selected-list', { payload }],
    ...config,
  });

  return query;
};

export default useGetBusinessGroupSelected;
