import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { AccessMenuControllerApi } from '@/services/openapi/user-management-service';

import type {
  GenericBucketRequestDtoAccessMenuSubmissionFilterRequest,
  GenericBucketResponseDtoAccessMenuListSubmissionResponse,
} from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AccessMenuControllerApi();

const useGetApprovalList = (
  payload: GenericBucketRequestDtoAccessMenuSubmissionFilterRequest,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoAccessMenuListSubmissionResponse>>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {

        const res = await api.retrieveAllSubmission(payload);
        return res.data.data;
      },
      queryKey: [
        'access-menu-approval-list',
        payload
      ],
      ...config,
    }
  );

  return query;
};


export default useGetApprovalList;
