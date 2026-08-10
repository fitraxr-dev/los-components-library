import { useQuery } from '@tanstack/react-query';

import { VisitControllerApi } from '@/services/openapi/site-visit-service';

import type { BaseRequestDto } from '@/services/openapi/site-visit-service';


const api = new VisitControllerApi();

const useGetVisitLocationDetail = (
  payload: BaseRequestDto,
  isEnable?: boolean
) => {
  const query = useQuery({
    enabled: isEnable,
    queryFn: async () => {
      const response = await api.getDetailVisitLocations(payload);

      return response.data.data.content;
    },
    queryKey: ['site-visit-detail', payload],
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useGetVisitLocationDetail;
