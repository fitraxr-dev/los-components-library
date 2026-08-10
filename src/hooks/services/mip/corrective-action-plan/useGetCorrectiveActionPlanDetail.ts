import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface GetCorrectiveActionPlanDetailPayload {
  id: number;
}

interface UseGetCorrectiveActionPlanDetailProps {
  config?: {
    enabled?: boolean;
  };
  payload: GetCorrectiveActionPlanDetailPayload;
}

const useGetCorrectiveActionPlanDetail = ({ config, payload }: UseGetCorrectiveActionPlanDetailProps) => {
  const { id } = payload;

  const query = useQuery<any>({
    enabled: config?.enabled !== false && !!id,
    initialData: {},
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', { id });
        const response = await API('mip.correctiveActionPlan.getDetail', {
          data: { id },
        });
        console.log('API response:', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['get-corrective-action-plan-bucket-detail', id],
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetCorrectiveActionPlanDetail;
