import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { LpaInformationControllerApi } from '@/services/openapi/lpa-service';

import type { LpaInformationResponseDto, RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new LpaInformationControllerApi();

const useGetDetailLpaInformation = (
  payload: RequestByCodeAndProcessIdDto,
  config?: Partial<UseQueryOptions<LpaInformationResponseDto>>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.detailLpaInformation(payload);
        return res.data.data.content;
      },
      queryKey: ['get-lpa-information', payload],
      ...config,
    }
  );

  return query;
};

export default useGetDetailLpaInformation;
