import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetBmppGroupList = (payload: any) => {
  const query = useQuery<any>({
    enabled: !!(payload?.bmppType && payload?.bucketProcessId && payload?.module && payload?.process !== undefined),
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('mip.bmpp.groupList', {
          data: payload,
        });
        console.log('API response:', response);
        return response?.data?.data?.contents;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['bmpp-groups', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetBmppGroupList;
