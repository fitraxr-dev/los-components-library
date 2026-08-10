import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { LpaInformationControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/lpa-service';


const api = new LpaInformationControllerApi();

const useGetListLPAInformation = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.listLpaInformation(payload);

      return res.data.data;
    },
    queryKey: ['lpa-list', payload],
  });

  return query;
};

export default useGetListLPAInformation;
