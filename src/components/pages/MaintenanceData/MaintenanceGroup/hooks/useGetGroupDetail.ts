import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { GroupControllerApi } from '@/services/openapi/master-service';


const api = new GroupControllerApi();


const useGetGroupDetail = (payload: any) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDebtorGroupById(payload);
      return res?.data;
    },
    queryKey: ['get-group-detail', {
      debtorId: payload.debtorId,
      id: payload.groupId,
    }],
  });

  return query;
};

export default useGetGroupDetail;
