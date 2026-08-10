import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { VirtualAccountControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoVABucketListFilterDto } from '@/services/openapi/master-service';


const api = new VirtualAccountControllerApi();

const useGetGamList = () => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.retrieveGam();

      return res.data.data.contents;
    },
    queryKey: ['va-gam-list'],
  });
  return query;
};

export default useGetGamList;
