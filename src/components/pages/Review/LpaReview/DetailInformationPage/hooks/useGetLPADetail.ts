import { useQuery } from '@tanstack/react-query';

import { LpaInformationControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByCodeAndProcessIdDto, LpaInformationResponseDto } from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new LpaInformationControllerApi();

const useGetLPADetail = (
  payload: RequestByCodeAndProcessIdDto,
  config?: Partial<UseQueryOptions<LpaInformationResponseDto>>
) => {
  const queries = useQuery({
    queryFn: async () => {
      const res = await api.detailLpaInformation(payload);

      return res.data.data.content;
    },
    queryKey: ['lpa-detail', payload],
    ...config,
  });
  return queries;
};

export default useGetLPADetail;
