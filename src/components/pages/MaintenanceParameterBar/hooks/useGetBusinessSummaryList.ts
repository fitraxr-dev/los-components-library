import { useQuery } from '@tanstack/react-query';

import { getBusinessSummaryList } from './constant/getBusinessSummaryList';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetBusinessSummaryList = (module: string, config?: Partial<UseQueryOptions<any>>) => {
  const payload = {
    filter: {
      module: module,
    },
    page: {
      itemPerPage: 1000,
      noPage: 1,
    },
  };


  const query = useQuery<any>({
    enabled: !!module,
    queryFn: async () => {
      return await getBusinessSummaryList(payload);
    },
    queryKey: ['business-summary-list', module],
    ...config,
  });
  return query;
};

export default useGetBusinessSummaryList;
