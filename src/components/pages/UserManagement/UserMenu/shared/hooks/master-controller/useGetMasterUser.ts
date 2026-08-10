import { useQuery } from '@tanstack/react-query';

import { UserFunctionalControllerApi } from '@/services/openapi/user-management-service';

import type { UserRoleCode } from '../../components/UserForm/UserForm.types';
import type { AutocompleteUserRequest } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new UserFunctionalControllerApi;

const useGetMasterUser = (
  divisionCode: string[],
  roleCode: UserRoleCode,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    initialData: [],
    queryFn: async () => {

      const division = divisionCode.join(',');
      const role = roleCode === 'STAFF' ? 'TL' : 'KADIV';

      const payload: AutocompleteUserRequest =
      {
        division,
        position: null,
        role,
        value: null,
      };
      const res = await api.retrieveAllUserBySearch(payload);

      const { contents } = res.data.data;
      const result = contents.map((content) => ({
        label: content.fullName,
        value: content.userId,
      }));

      return result;

    },
    queryKey: ['user-management-list', roleCode],
    ...config,
  });

  return query;
};

export default useGetMasterUser;
