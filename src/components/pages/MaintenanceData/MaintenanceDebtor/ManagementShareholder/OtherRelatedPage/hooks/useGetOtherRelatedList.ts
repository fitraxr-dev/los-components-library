import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetOtherRelatedList = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('master.otherRelated.list', { data: payload });

      return res.data.data;
    },
    queryKey: ['other-related-list', payload],
    ...config,
  });

  return query;
};

export default useGetOtherRelatedList;
