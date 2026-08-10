import { useQuery } from '@tanstack/react-query';

import { MaintenanceShareholderControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoListMShareholderRequestDto,
  GenericBucketWithAdditionalDataResponseDtoMShareholderListResponseDtoGeneralAdditionalDataLastUpdated,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MaintenanceShareholderControllerApi();

const useGetShareholderList = (
  payload: GenericBucketRequestDtoListMShareholderRequestDto,
  // eslint-disable-next-line max-len
  config?: Partial<UseQueryOptions<GenericBucketWithAdditionalDataResponseDtoMShareholderListResponseDtoGeneralAdditionalDataLastUpdated>>

) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getCustomerMaintenanceShareholder(payload);
      const shareholderData = res.data.data;
      return shareholderData;
    },
    queryKey: ['shareholders-list', payload],
    ...config,
  });

  return query;
};

export default useGetShareholderList;
