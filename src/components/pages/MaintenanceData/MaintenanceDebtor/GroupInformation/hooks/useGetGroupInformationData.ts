import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type {
  BaseResponseGenericBucketResponseDtoMaintenanceGroupMemberList,
  GenericBucketRequestDtoMaintenanceGroupFilterRequest,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MaintenanceCustomerControllerApi();

const useGetGroupInformationData = (
  payload: GenericBucketRequestDtoMaintenanceGroupFilterRequest,
  config?: Partial<UseQueryOptions<BaseResponseGenericBucketResponseDtoMaintenanceGroupMemberList>>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.findGroupByDebtor(payload);
        return res?.data;
      },
      queryKey: [
        'maintenance-group-list',
        payload
      ],
      ...config,
    }
  );

  return query;

};

export default useGetGroupInformationData;
