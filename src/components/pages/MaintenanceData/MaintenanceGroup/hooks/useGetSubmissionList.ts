import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoGetBucketDebtorGroupMappingRequestDto,
  GenericBucketRequestDtoMaintenanceGroupFilterRequest,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new GroupV2ControllerApi();

const useGetSubmissionData = (
  payload: GenericBucketRequestDtoMaintenanceGroupFilterRequest,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.submissionAll(payload);
        return res?.data?.data;
      },
      queryKey: [
        'maintenance-group-list',
        payload
      ],
    }
  );

  return query;

};

export default useGetSubmissionData;
