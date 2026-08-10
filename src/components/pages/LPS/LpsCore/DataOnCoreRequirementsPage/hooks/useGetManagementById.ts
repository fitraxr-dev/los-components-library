import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { DetailManagementRequestDto } from '../DataOnCoreRequirements.type';


const useGetManagement = (payload: DetailManagementRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.regulatorData.detailSlikManagement', {
        data: payload,
      });

      return res?.data?.data?.content;
    },
    queryKey: ['management-detail', payload],
  },
  );

  return query;
};


export default useGetManagement;
