import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { ProcessorControllerApi } from '@/services/openapi/processor-service';

import type { MipStepProgressResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/processor-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ProcessorControllerApi();

const useGetStepMaintenance = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<MipStepProgressResponseDto>>
) => {
  const path = usePathname();
  const enabled =
    payload.bucketProcessId !== undefined &&
    payload.bucketProcessId !== null &&
    !path.includes('member');


  const query = useQuery({
    enabled,
    placeholderData: {
      progress: 0,
      steps: [],
    },
    queryFn: async () => {
      const res = await api.stepperBucket(payload);

      return res.data.data.content;
    },
    ...config,
    queryKey: ['maintenance-step', payload],
  });

  return query;
};

export default useGetStepMaintenance;
