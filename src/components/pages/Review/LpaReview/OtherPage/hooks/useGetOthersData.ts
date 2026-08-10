import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { OthersControllerApi } from '@/services/openapi/lpa-service';

import type {
  GenericSingleDtoRecommendationResponseDto,
  RequestByProcessIdDtoString,
} from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new OthersControllerApi();


const useGetOthersData = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<GenericSingleDtoRecommendationResponseDto>>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getDetailOthers1(payload);
        return res.data.data;
      },
      queryKey: [
        'others',
        payload
      ],
      ...config,
    }
  );

  return query;
};


export default useGetOthersData;
