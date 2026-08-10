import { useMutation } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';
import { MenuControllerApi } from '@/services/openapi/user-management-service';

import type { UserManageRequest } from '@/services/openapi/user-management-service';


const api = new MenuControllerApi;

const useCreateOrUpdateAccessMenu = ({
  onSuccess = () => {},
  onError = (res) => {},
}) => {
  const pathname = usePathname();
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      let result;
      const isCreateNewAccessMenu = getLastPath(pathname) === 'add-access-menu';

      if (isCreateNewAccessMenu) {
        const res = await api.createAccessMenu(payload);
        result = res.data;
      } else {
        const res = await api.updateAccessMenu(payload);
        result = res.data;
      }

      return result;
    },
    onError: (res) => {
      onError(res);
    },
    onSuccess: (_, variable) => {
      // queryClient.invalidateQueries({ queryKey: ['credit-checking-request',
      // { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useCreateOrUpdateAccessMenu;
