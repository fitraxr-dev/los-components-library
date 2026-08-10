import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoRequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new ApplicationDebtorControllerApi();

const useGetBusinessGroupList = (payload: GenericBucketRequestDtoRequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: payload !== undefined && payload !== null,
    placeholderData: keepPreviousData,
    queryFn: async () => {

      const res = await api.getListDebtorGroupSelected(payload);
      return res.data.data.contents;
    },
    queryKey: ['debtor-group-selected-list', { payload }],
  });

  return query;
};

export default useGetBusinessGroupList;
