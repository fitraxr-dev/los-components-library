import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type {
  BaseResponseGenericBucketResponseDtoDebtorListResponseDto,
  GenericBucketRequestDtoDebtorFilterRequestDto,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DebtorV2ControllerApi();

const useGetMasterDebtor = (
  payload: GenericBucketRequestDtoDebtorFilterRequestDto,
  config?: Partial<UseQueryOptions<BaseResponseGenericBucketResponseDtoDebtorListResponseDto>>
) => {
  const query = useQuery(
    {
      // placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getAllDebtor(payload);
        return res.data;
      },
      queryKey: [
        'master-debtor-list',
        payload
      ],
      ...config,
    }
  );

  return query;
};


export default useGetMasterDebtor;
