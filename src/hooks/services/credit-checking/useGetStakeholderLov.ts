import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type StakeholderLovParams = {
  bucketProcessId: string;
  type: 'debtor' | 'management' | 'shareholder' | 'other_related';
};

const useGetStakeholderLov = (params: StakeholderLovParams, config?: Partial<UseQueryOptions<any[]>>) => {
  return useQuery<any[]>({
    queryFn: async () => {
      try {
        console.log('Fetching stakeholder lov with params:', params);
        const response = await API('creditChecking.result.stakeholderLov', {
          data: params,
        });
        console.log('Stakeholder lov response data:', response?.data?.data);
        return response?.data?.data?.contents || [];
      } catch (error) {
        console.error('Stakeholder lov error:', error);
        throw error;
      }
    },
    queryKey: ['stakeholder-lov', params],
    ...config,
  });
};

export default useGetStakeholderLov;
