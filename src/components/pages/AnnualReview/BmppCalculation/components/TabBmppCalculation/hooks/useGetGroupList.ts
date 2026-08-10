import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDtoMaintenanceGroupSubmissionFilterRequest } from '../TabBmppCalculation.types';


const useGetGroupList = (payload: GenericBucketRequestDtoMaintenanceGroupSubmissionFilterRequest) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.groupName.submission', {
        data: payload,
      });

      return res.data.data;
    },
    queryKey: ['group-dropdown-list', payload],
  });

  return query;
};

export default useGetGroupList;
