import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetDetailRoutineReport = (payload: any) => {
  const query = useQuery<any>({
    enabled: !!payload?.id,
    queryFn: async () => {
      try {
        console.log('Calling API (mip) getDetailRoutineReporting with payload:', payload);
        const response = await API('mip.routineReporting.getDetail', {
          data: payload,
        });
        console.log('API response (mip detail routine reporting):', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('API error (mip detail routine reporting):', error);
        throw error;
      }
    },
    queryKey: ['get-detail-routine-reporting-mip', { id: payload?.id }],
    refetchOnMount: 'always',
  });

  return query;
};

export default useGetDetailRoutineReport;
