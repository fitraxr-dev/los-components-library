import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetDetailRiskProfile = (payload: any) => {

  const bucketProcessId = payload?.bucketProcessId;

  const query = useQuery({
    enabled: !!bucketProcessId,

    queryFn: async () => {
      try {
        console.log('Calling API getDetailRiskProfile with payload:', payload);
        const response = await API('mip.riskProfile.getDetail', {
          data: payload,
        });
        console.log('API response (getDetailRiskProfile):', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('API error (getDetailRiskProfile):', error);
        throw error;
      }
    },
    queryKey: ['risk-profile-detail', bucketProcessId],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetDetailRiskProfile;
