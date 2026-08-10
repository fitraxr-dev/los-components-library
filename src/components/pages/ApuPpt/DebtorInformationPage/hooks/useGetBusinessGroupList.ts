import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { GetAllDebtorGroupRequestDto } from '@/services/openapi/bucket-service';


const api = new ApplicationDebtorControllerApi();

const useGetBusinessGroupList = (payload: GetAllDebtorGroupRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListDebtorGroup(payload);

      return res;
    },
    queryKey: ['apuppt-business-group-list', {
      bucketProcessId: payload.bucketProcessId,
      module: payload.module,
      process: payload.process,
    }],
    select: (response) => response.data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetBusinessGroupList;
