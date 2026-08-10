import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { API } from '@/helpers/api';

import type { GenericBucketRequestDtoListMManagementRequestDto } from '../DataOnCoreRequirements.type';


const useGetManagementList = (
  payload: GenericBucketRequestDtoListMManagementRequestDto,
  options?: any
) => {
  const query = useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.regulatorData.listSlikManagement', {
        data: payload,
      });
      const managementData = res.data.data;

      return managementData;
    },
    queryKey: ['management-list', payload],
  });

  return query;
};

export default useGetManagementList;
