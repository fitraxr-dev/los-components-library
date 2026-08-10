import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { mip, analyst } from '@/configs/constants/pathname';
import { ProcessorControllerApi } from '@/services/openapi/processor-service';

import type { MipStepProgressResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/processor-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ProcessorControllerApi();

const useGetStepMip = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<MipStepProgressResponseDto>>
) => {
  const path = usePathname();
  const enabled =
    payload.bucketProcessId !== undefined &&
    payload.bucketProcessId !== null &&
    path !== mip.LIST_PAGE &&
    path !== analyst.LIST_PAGE;

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
    queryKey: ['mip-step', payload],
    ...config,
  });

  return query;
};

export default useGetStepMip;
