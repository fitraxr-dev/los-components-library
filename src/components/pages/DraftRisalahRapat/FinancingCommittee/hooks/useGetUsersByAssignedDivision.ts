import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { RisalahRapatVerificationResultControllerApi } from '@/services/openapi/agreement-service';

import type { RisalahRapatListUserCollaborationByDivisionRequestDto } from '@/services/openapi/agreement-service';


const api = new RisalahRapatVerificationResultControllerApi();


const useGetUsersByAssignedDivision = (
  payload: RisalahRapatListUserCollaborationByDivisionRequestDto,
) => {
  const query = useQuery({
    initialData: { userList: []},
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListUserCollaborationByDivision(payload);

      return res.data.data.content;
    },
    queryKey: ['division-user-list', payload],
  });
  return query;
};

export default useGetUsersByAssignedDivision;
