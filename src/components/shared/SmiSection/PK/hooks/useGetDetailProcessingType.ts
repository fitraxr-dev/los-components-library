import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { PkProcessingTypeControllerApi } from '@/services/openapi/agreement-service';

import type {
  PKProcessingTypeResponseDto,
  PKProcessingTypeDetailRequestDto,
} from '@/services/openapi/agreement-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new PkProcessingTypeControllerApi();

const useGetDetailProcessingType = (
  payload: PKProcessingTypeDetailRequestDto,
  config?: Partial<UseQueryOptions<PKProcessingTypeResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailProcessingType(payload);

      return res.data.data.content;
    },
    queryKey: ['detail-pk-processing-type-report', payload.bucketProcessId === null || payload.bucketProcessId === undefined ? payload.id : payload.bucketProcessId],
    staleTime: ONE_MINUTE,
    ...config,
  });
  return query;
};

export default useGetDetailProcessingType;
