import { useMemo } from 'react';

import useGetAppsMenu from '@/components/pages/UserManagement/AccessMenu/hooks/useGetAccessMenuById';


interface Permission {
  id: string;
  label: string;
  status: number;
}

interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  status: number;
  permissions?: Permission[];
  subMenu?: MenuItem[];
}

/**
 * Hook to check access permission for a specific permission ID
 * @param permissionId - The permission ID to check access for
 * @returns boolean - true if permission granted (status === 1), false otherwise
 */
const useCheckAccess = (permissionId: string): boolean => {
  const { data: menuList } = useGetAppsMenu();
  const permissionStatus = useMemo(() => {
    try {
      const accessMenuData = localStorage.getItem('accessMenu');
      // const accessMenuData = JSON.stringify(menuList);

      if (!accessMenuData) {
        return false;
      }

      const menuData: MenuItem[] = JSON.parse(accessMenuData);

      if (!Array.isArray(menuData)) {
        return false;
      }

      // Recursive function to search through nested menu structure
      const findPermission = (items: MenuItem[]): Permission | null => {
        for (const item of items) {
          // Check permissions at current level
          if (item.permissions) {
            const permission = item.permissions.find((perm) => perm.id === permissionId);
            if (permission) {
              return permission;
            }
          }

          // Recursively search subMenu
          if (item.subMenu) {
            const found = findPermission(item.subMenu);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };

      const permission = findPermission(menuData);

      // Return true if permissionStatus is 1, false otherwise
      return permission ? permission.status === 1 : false;
    } catch (error) {
      console.error('Error checking access permission:', error);
      return false;
    }
  }, [permissionId]);

  return permissionStatus;
};

export default useCheckAccess;
