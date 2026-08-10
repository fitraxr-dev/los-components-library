import { useQuery } from '@tanstack/react-query';

import { GroupControllerApi } from '@/services/openapi/master-service';

import type { GetGroupByIdRequestDto } from '@/services/openapi/master-service';


const api = new GroupControllerApi();

const useGetGroupDetail = (payload: GetGroupByIdRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const response = await api.getDebtorGroupById(payload);

      return response.data.data.content;
    },
    queryKey: ['group-debtor-id', payload],
  });

  return query;
};

export default useGetGroupDetail;
