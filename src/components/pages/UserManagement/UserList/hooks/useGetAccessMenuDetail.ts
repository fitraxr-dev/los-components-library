import { useQuery } from '@tanstack/react-query';

import { AccessMenuControllerApi } from '@/services/openapi/user-management-service';

import type { AccessMenuDetailResponse, RequestByIdDtoString } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AccessMenuControllerApi();

const useGetAccessMenuDetail = (
  payload: RequestByIdDtoString,
  config?: Partial<UseQueryOptions<AccessMenuDetailResponse>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.retrieveDetailAccessMenu(payload);

      return res.data.data.content;
    },
    queryKey: ['access-menu-detail', payload.id],
    ...config,
  });

  return query;
};

export default useGetAccessMenuDetail;
