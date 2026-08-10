import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetListHistoryLaporanAssignment = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const response = await API('report.reassignment.history', { data: payload });
      return response.data.data;
    },
    queryKey: ['report-laporan-reassignment-history', payload],
    ...config,
  });

  return query;
};

export default useGetListHistoryLaporanAssignment;
