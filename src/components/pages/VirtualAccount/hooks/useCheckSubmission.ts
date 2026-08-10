import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { VirtualAccountControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoString } from '@/services/openapi/master-service';


const api = new VirtualAccountControllerApi();

const useCheckSubmission = (payload: RequestByIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.checkSubmissionVA(payload);

      return res.data.data;
    },
    queryKey: ['va-check-submission', payload],
  });
  return query;
};

export default useCheckSubmission;
