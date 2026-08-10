import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ManagementControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoGetByDebtorIdRequestDto } from '@/services/openapi/bucket-service';


const api = new ManagementControllerApi();

const useGetManagementList = (payload: GenericBucketRequestDtoGetByDebtorIdRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAllManagementByDebtorId(payload);

      return res.data;
    },
    queryKey: ['managements', payload],
    select: (data) => data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetManagementList;
