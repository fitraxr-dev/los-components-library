import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceCapitalControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoString } from '@/services/openapi/master-service';


const api = new MaintenanceCapitalControllerApi();

const useGetApprovalStatusList = (
  payload: GenericBucketRequestDtoString,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.listBucketCapital(payload);
        return res?.data?.data;
      },
      queryKey: [
        'approval-status-modal-list',
        payload
      ],
    }
  );

  return query;

};

export default useGetApprovalStatusList;
