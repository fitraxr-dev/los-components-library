import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  RisalahRapatVerificationResultControllerApi,
  type RequestByProcessIdDtoString,
} from '@/services/openapi/agreement-service';


const api = new RisalahRapatVerificationResultControllerApi();

const useGetCollaborationDivisions = (
  payload: RequestByProcessIdDtoString,
) => {
  const query = useQuery({
    initialData: {},
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getUserCollaborationDivision(payload);

      return res.data.data.content;
    },
    queryKey: ['division-collaboration-list', payload],
  });

  return query;
};

export default useGetCollaborationDivisions;
