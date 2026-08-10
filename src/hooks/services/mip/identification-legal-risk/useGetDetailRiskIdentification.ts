import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetDetailRiskIdentification = (payload: any) => {
  const query = useQuery<any>({
    enabled: Boolean(payload?.bucketProcessId || payload?.processId),
    queryFn: async () => {
      try {
        console.log('Calling API getDetailIdentificationLegalRisk with payload:', payload);
        const response = await API('mip.identificationLegalRisk.getDetail', {
          data: payload,
        });
        console.log('API response (getDetailIdentificationLegalRisk):', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('API error (getDetailIdentificationLegalRisk):', error);
        throw error;
      }
    },
    queryKey: ['risk-identification-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetDetailRiskIdentification;
