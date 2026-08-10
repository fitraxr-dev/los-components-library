import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { VirtualAccountControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoVABucketListFilterDto } from '@/services/openapi/master-service';


const api = new VirtualAccountControllerApi();

const useGetSubmissionList = (payload: GenericBucketRequestDtoVABucketListFilterDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getSubmissionVA(payload);

      return res.data.data;
    },
    queryKey: ['va-submission-list', payload],
  });
  return query;
};

export default useGetSubmissionList;
