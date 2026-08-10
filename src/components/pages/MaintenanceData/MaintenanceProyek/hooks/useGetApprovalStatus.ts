import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ProjectV2ControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoApprovalStatusFilterRequest } from '@/services/openapi/master-service';


const api = new ProjectV2ControllerApi();

const useGetApprovalStatus = (
  payload: GenericBucketRequestDtoApprovalStatusFilterRequest,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getListApprovalStatusMaintenanceProject(payload);
        return res?.data;
      },
      queryKey: [
        'approval-status-maintenance-proyek-list',
        payload
      ],
    }
  );

  return query;

};

export default useGetApprovalStatus;
