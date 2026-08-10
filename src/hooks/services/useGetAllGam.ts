import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { UserControllerApi } from '@/services/openapi/user-management-service';

import type {
  AutocompleteRequest,
  GenericListDtoUserDetailResponse,
  UserDetailResponse,
} from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new UserControllerApi();

const useGetAllGam = (
  payload: AutocompleteRequest,
  options: Object = {
    division: 'division',
    label: 'fullName',
    value: 'userId',
  },
  config?: Partial<UseQueryOptions<GenericListDtoUserDetailResponse>>
) => {
  const query = useQuery<any>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.userGamUncensored(payload);
      const result = res.data.data.contents;

      return result.map((data) => {
        const finalObject = {};

        for (const [key, value] of Object.entries(options)) {
          finalObject[key] = data[value];
        }

        return finalObject;
      });
    },
    queryKey: ['gams', payload],
    select: (res: UserDetailResponse) => res,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetAllGam;
