import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { mip, analyst } from '@/configs/constants/pathname';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetStepMip = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const path = usePathname();
  const enabled =
    payload?.bucketProcessId !== undefined &&
    payload?.bucketProcessId !== null &&
    path !== mip.LIST_PAGE &&
    path !== analyst.LIST_PAGE;

  const query = useQuery<any>({
    enabled,
    placeholderData: {
      progress: 0,
      steps: [],
    },
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('processor.bucket.stepper', {
          data: payload,
        });
        console.log('API response:', response);
        return response.data.data.content;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['mip-step', payload],
    ...config,
  });

  return query;
};

export default useGetStepMip;
