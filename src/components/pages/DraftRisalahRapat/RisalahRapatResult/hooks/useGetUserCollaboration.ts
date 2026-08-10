import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RisalahRapatVerificationResultControllerApi } from '@/services/openapi/agreement-service';

import type { GenericBucketRequestDtoRequestByProcessIdDtoString } from '@/services/openapi/agreement-service';


const api = new RisalahRapatVerificationResultControllerApi();

const useGetUserCollaboration = (
  payload: GenericBucketRequestDtoRequestByProcessIdDtoString,
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListUserCollaborationUnassigned(payload);

      return res.data.data;
    },
    queryKey: ['user-collaboration-list', payload],
    staleTime: ONE_MINUTE,
  });
  return query;
};

export default useGetUserCollaboration;
