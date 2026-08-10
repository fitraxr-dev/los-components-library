import { useQueryClient } from '@tanstack/react-query';

import { LOGIN_PAGE } from '@/configs/constants/pathname';
import logout from '@/services/api/auth/logout';

import useCustomRouter from './useCustomRouter';


const useLogout = () => {
  const route = useCustomRouter();
  const queryClient = useQueryClient();

  const onLogout = async () => {
    window.sessionStorage.clear();
    window.localStorage.removeItem('accessMenu');
    window.localStorage.removeItem('notificationCount');
    window.localStorage.removeItem('bucketProcessIdVA');
    queryClient.removeQueries();
    await logout();

    queryClient.invalidateQueries({ queryKey: ['apps-menu']});
    route.push(LOGIN_PAGE);
  };

  return {
    onLogout,
  };
};

export default useLogout;
