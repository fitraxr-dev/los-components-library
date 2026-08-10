import { useQuery } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { GetAllDebtorGroupRequestDto } from '@/services/openapi/bucket-service';


const api = new ApplicationDebtorControllerApi();

const useGetBusinessGroupList = (payload: GetAllDebtorGroupRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListDebtorGroup(payload);

      return res.data?.data?.contents;
    },
    queryKey: ['business-group-list', payload],
  });
  return query;
};

export default useGetBusinessGroupList;
