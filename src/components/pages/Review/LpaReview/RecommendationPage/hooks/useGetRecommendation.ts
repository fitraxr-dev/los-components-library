import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { RecommendationControllerApi } from '@/services/openapi/lpa-service';

import type {
  GenericSingleDtoRecommendationResponseDto,
  RequestByProcessIdDtoString,
} from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new RecommendationControllerApi();


const useGetRecommendation = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<GenericSingleDtoRecommendationResponseDto>>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getDetailOthers(payload);
        return res.data.data;
      },
      queryKey: [
        'recommendation',
        payload
      ],
      ...config,
    }
  );

  return query;
};


export default useGetRecommendation;
