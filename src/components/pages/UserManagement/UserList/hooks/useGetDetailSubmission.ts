import { useQuery } from '@tanstack/react-query';

import { UserV2ControllerApi } from '@/services/openapi/user-management-service';

import type { UserDetailDraftV2Response, UserDraftDetailRequest } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new UserV2ControllerApi();

const useGetDetailSubmission = (
  payload: UserDraftDetailRequest,
  config?: Partial<UseQueryOptions<UserDetailDraftV2Response>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailSubmission(payload);

      return res.data.data;
    },
    queryKey: ['um-submission-detail', payload],
    ...config,
  });

  return query;
};

export default useGetDetailSubmission;
