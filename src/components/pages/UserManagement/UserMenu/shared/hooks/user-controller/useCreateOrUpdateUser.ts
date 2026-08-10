import { useMutation } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';
import { UserControllerApi } from '@/services/openapi/user-management-service';

import type { UserManageRequest } from '@/services/openapi/user-management-service';


const api = new UserControllerApi;

const useCreateOrUpdateUser = ({
  onSuccess = (res) => {},
  onError = (res) => {},
}) => {
  const pathname = usePathname();
  const mutation = useMutation({
    mutationFn: async (payload: UserManageRequest) => {
      let result;
      const isCreateNewUser = getLastPath(pathname) === 'add-user';

      if (isCreateNewUser) {
        const res = await api.createNewUser(payload);
        result = res.data;
      } else {
        const res = await api.updateDataUser(payload);
        result = res.data;
      }

      return result;
    },
    onError: (res) => {
      onError(res);
    },
    onSuccess: (res, variable) => {
      // queryClient.invalidateQueries({ queryKey: ['credit-checking-request',
      // { bucketProcessId: variable.bucketProcessId }]});
      onSuccess(res);
    },
  });

  return mutation;
};

export default useCreateOrUpdateUser;
