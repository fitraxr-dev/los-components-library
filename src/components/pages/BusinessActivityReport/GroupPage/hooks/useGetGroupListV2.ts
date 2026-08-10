import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { GroupControllerApi } from '@/services/openapi/bucket-service';

import type { AutoCompleteProjectDto, GenericListDtoGroupResponseDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new GroupControllerApi();

const useGetGroupListV2 = (
  payload: AutoCompleteProjectDto,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<GenericListDtoGroupResponseDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.autoCompleteGroupPipeline(payload);

      return res.data.data;
    },
    queryKey: ['group-list', payload],
    select: (res: GenericListDtoGroupResponseDto) => res,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetGroupListV2;
