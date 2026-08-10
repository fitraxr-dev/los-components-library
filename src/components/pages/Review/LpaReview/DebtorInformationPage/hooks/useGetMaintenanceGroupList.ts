import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


type MaintenanceGroupListPayload = {
  page: {
    noPage: number;
    itemPerPage: number;
  };
  filter: {
    debtorId?: string;
    bucketProcessId?: string;
    module?: string;
    process?: string;
  };
};

const useGetMaintenanceGroupList = (payload: MaintenanceGroupListPayload) => {
  const query = useQuery({
    enabled: payload !== undefined && payload !== null,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.group.list', {
        data: payload,
      });
      return res.data;
    },
    queryKey: ['maintenance-group-list', { payload }],
  });

  return query;
};

export default useGetMaintenanceGroupList;
