import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetProcessNonBusiness = (
  menuCode: string,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!menuCode,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await API('dashboard.process.processNonBusiness', {
        data: { menuCode },
      });

      return response.data.data;
    },
    queryKey: ['process-non-business', menuCode],
    ...config,
  });

  return query;
};

export default useGetProcessNonBusiness;
