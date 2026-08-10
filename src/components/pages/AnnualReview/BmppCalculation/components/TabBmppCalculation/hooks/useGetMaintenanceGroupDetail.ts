import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { RequestByIdDtoString } from '../TabBmppCalculation.types';


const useGetMaintenanceGroupDetail = (payload: RequestByIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.groupName.submissionDetail', {
        data: payload,
      });
      return res.data.data;
    },
    queryKey: ['maintenance-group-detail', payload],
  });

  return query;
};

export default useGetMaintenanceGroupDetail;
