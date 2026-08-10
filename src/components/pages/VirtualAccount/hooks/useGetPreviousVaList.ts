import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { VirtualAccountControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoVAListFilterDto } from '@/services/openapi/master-service';


const api = new VirtualAccountControllerApi();

const useGetPreviousVaList = (payload: GenericBucketRequestDtoVAListFilterDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getPreviousVAList(payload);

      return res.data.data;
    },
    queryKey: ['va-list-previous', payload],
  });
  return query;
};

export default useGetPreviousVaList;
