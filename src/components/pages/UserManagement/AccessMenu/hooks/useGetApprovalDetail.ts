import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { AccessMenuControllerApi } from '@/services/openapi/user-management-service';

import type { AccessMenuDetailResponse, RequestByIdDtoString } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new AccessMenuControllerApi();

const useGetApprovalDetail = (
  payload: RequestByIdDtoString,
  config?: Partial<UseQueryOptions<AccessMenuDetailResponse>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.retrieveDetailSubmission(payload);

      return res?.data.data.content;
    },
    queryKey: ['access-menu-approval-list-detail', payload],
    ...config,
  });

  return query;
};


export default useGetApprovalDetail;
