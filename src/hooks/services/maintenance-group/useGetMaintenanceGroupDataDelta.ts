import { useQuery } from '@tanstack/react-query';

import { GroupV2ControllerApi } from '@/services/openapi/master-service';

import type { SubmissionGroupDetailRequest } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new GroupV2ControllerApi();

interface GroupDataDeltaPayload {
  bucketProcessId: string;
  groupCode: string;
}

interface GroupDataDeltaResponse {
  groupName?: {
    current: string;
    previous: string;
  };
  group?: {
    current: {
      key: string;
      label: string;
    };
    previous: {
      key: string;
      label: string;
    };
  };
  sector?: {
    current: {
      key: string;
      label: string;
    };
    previous: {
      key: string;
      label: string;
    };
  };
  yearFounded?: {
    current: number;
    previous: number;
  };
  isRelatedSmi?: {
    current: boolean;
    previous: boolean;
  };
}

const useGetMaintenanceGroupDataDelta = (
  payload: GroupDataDeltaPayload,
  config?: Partial<UseQueryOptions<GroupDataDeltaResponse>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const requestPayload: SubmissionGroupDetailRequest = {
        bucketProcessId: payload.bucketProcessId,
        groupCode: payload.groupCode,
      };

      const res = await api.detailGroupSubmissionPrevious(requestPayload);
      return res.data.data.content as GroupDataDeltaResponse;
    },
    queryKey: ['detail-maintenance-group-data-delta', payload],
    ...config,
  });

  return query;
};

export default useGetMaintenanceGroupDataDelta;
