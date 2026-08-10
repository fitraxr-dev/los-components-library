import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { GenericListDtoGroupResponseDto, GetAllDebtorGroupRequestDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ApplicationDebtorControllerApi();

const useGetBusinessGroupList = (
  payload: GetAllDebtorGroupRequestDto,
  config?: Partial<UseQueryOptions<GenericListDtoGroupResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListDebtorGroup(payload);

      return res.data.data;
    },
    queryKey: ['credit-checking-business-group-list', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetBusinessGroupList;
