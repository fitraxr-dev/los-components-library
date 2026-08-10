import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ConcernControllerApi } from '@/services/openapi/mip-service';

import type { ConcernResponseDto, RequestByIdDtoLong } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ConcernControllerApi();

interface DetailConcernDto {
  payload: RequestByIdDtoLong;
  config?: Partial<UseQueryOptions<ConcernResponseDto>>;
}

const useGetConcernDetail = ({ payload, config }: DetailConcernDto) => {
  const query = useQuery({
    initialData: {},
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDetailConcern(payload);

      return res.data.data.content;
    },
    queryKey: ['concern-detail', {
      ...payload,
    }],
    ...config,
  });

  return query;
};

export default useGetConcernDetail;
