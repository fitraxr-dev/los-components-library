import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { GetAllDebtorGroupRequestDto, GroupResponseDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ApplicationDebtorControllerApi();

const useGetBusinessGroupList = (
  payload: GetAllDebtorGroupRequestDto,
  config?: Partial<UseQueryOptions<GroupResponseDto[]>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await api.getListDebtorGroup(payload);

      return response.data?.data?.contents;
    },
    queryKey: ['business-group-list', payload],
    ...config,
  });
  return query;
};

export default useGetBusinessGroupList;
