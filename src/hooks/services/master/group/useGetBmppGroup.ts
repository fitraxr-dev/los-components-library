import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetBmppGroup = (
  payload: any,
  config?: Partial<any>
) => {
  const query = useQuery<any>({
    enabled: payload.filter.debtorId !== null && payload.filter.debtorId !== undefined,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await API('master.groupName.listById', {
        data: payload,
      });
      return response?.data?.data;
    },
    queryKey: ['bmpp-group', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetBmppGroup;
