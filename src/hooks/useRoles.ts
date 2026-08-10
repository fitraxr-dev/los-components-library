import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { accessPage } from '@/configs/roles';
import { removeCookie } from '@/helpers/cookie';

import useApp from './useApp';


const useRoles = () => {
  const [state] = useApp();
  const { currentRole } = state;
  const pathname = usePathname();
  const roleAccess = accessPage[pathname];

  if (!currentRole?.length) removeCookie('token');
  if (!roleAccess) return true; // pass to not found page
  if (roleAccess[0] === roles.ALL) return true;

  for (const allowedRoles of roleAccess) {
    if (currentRole?.includes(allowedRoles)) {
      return true;
    };
  };

  return false;
};

export default useRoles;
