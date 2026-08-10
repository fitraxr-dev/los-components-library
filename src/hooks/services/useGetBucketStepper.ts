import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { MipStepProgressResponseDto, RequestByProcessIdDtoString } from './useGetBucketStepper.types';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetBucketStepper = (
  payload: RequestByProcessIdDtoString,
  intervalRefetch?: any,
  config?: Partial<UseQueryOptions<MipStepProgressResponseDto>>
) => {
  const { bucketProcessId, process, module } = payload;

  const query = useQuery({
    enabled: !!bucketProcessId && !!module && !!process,
    placeholderData: {
      progress: 0,
      steps: [],
    },
    queryFn: async () => {
      try {
        const res = await API('processor.bucket.stepper', {
          data: payload,
        });

        return res.data?.data?.content ?? {
          progress: 0,
          steps: [],
        };
      } catch (error) {
        return {
          progress: 0,
          steps: [],
        };
      }
    },
    queryKey: ['bucket-stepper', payload],
    ...config,
    refetchInterval: intervalRefetch === undefined || intervalRefetch === null ? 5000 : intervalRefetch,
  });

  return query;
};

export default useGetBucketStepper;
