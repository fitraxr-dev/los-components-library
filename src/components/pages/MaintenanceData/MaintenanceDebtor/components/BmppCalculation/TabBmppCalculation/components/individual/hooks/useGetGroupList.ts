import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoMaintenanceGroupSubmissionFilterRequest } from '@/services/openapi/master-service';


const api = new GroupV2ControllerApi();

const useGetGroupList = (payload: GenericBucketRequestDtoMaintenanceGroupSubmissionFilterRequest) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.submissionAll(payload);

      return res.data.data;
    },
    queryKey: ['group-dropdown-list', payload],
  });

  return query;
};

export default useGetGroupList;
