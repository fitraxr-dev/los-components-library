import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { PipelineControllerApi } from '@/services/openapi/bucket-service';

import type {
  BaseResponseGenericSingleDtoPipelineStatusResponseDto,
  PipelineStatusRequestDto,
  PipelineStatusResponseDto,
} from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new PipelineControllerApi();

const useGetPipelineStatus = (payload: PipelineStatusRequestDto, config?: Partial<UseQueryOptions>) => {
  const query = useQuery<PipelineStatusResponseDto>({
    enabled: payload.bucketProcessId !== undefined &&
    payload.bucketProcessId !== null &&
    payload.bucketProcessId !== '',
    queryFn: async () => {
      const res = await api.statusPipeline(payload);

      return res.data;
    },
    queryKey: ['pipeline-status', { id: payload.bucketProcessId }],
    select: (res: BaseResponseGenericSingleDtoPipelineStatusResponseDto) => res?.data.content,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetPipelineStatus;
