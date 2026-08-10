import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoRequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new ApplicationDebtorControllerApi();

const useGetBusinessGroupList = (payload: GenericBucketRequestDtoRequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBusinessGroupDebtor(payload);

      return res;
    },
    queryKey: ['credit-checking-business-group-list', {
      filter: payload.filter,
      page: {
        itemPerPage: payload.page.itemPerPage,
        noPage: payload.page.noPage,
      },
    }],
    select: (response) => response.data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetBusinessGroupList;
