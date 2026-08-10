import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { PipelineControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoRefinaRequestDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new PipelineControllerApi();

const useGetRefinaByPipelineProcessId
  = (
    payload: GenericBucketRequestDtoRefinaRequestDto,
    config?: Partial<UseQueryOptions<any>>
  ) => {
    const query = useQuery(
      {
        placeholderData: keepPreviousData,
        queryFn: async () => {
          const res = await api.getRefina(payload);
          return res.data.data;
        },
        queryKey: [
          'refina-list',
          payload
        ],
        ...config,
      }
    );

    return query;
  };


export default useGetRefinaByPipelineProcessId;
