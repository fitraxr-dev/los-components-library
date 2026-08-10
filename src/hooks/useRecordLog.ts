import { useCallback } from 'react';

import { usePathname } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { getLastPath } from '@/helpers/navigation';
import recordLog from '@/services/api/recordLog';

import useGetAppsMenu from '@/components/pages/UserManagement/AccessMenu/hooks/useGetAccessMenuById';

import useApp from './useApp';
import useIdentity from './useIdentity';

import type { UseRecordLogParams } from '@/types/RecordLog';

// UseRecordLogParams
// activity?: string;
// bucketProcessId?: string;
// process?: string;
// menuCode?: string;
// module?: string;
// menuCode?: string;
// changeBefore?: string;
// changeAfter?: string;
// remarks?: string;

const useRecordLog = (params?: UseRecordLogParams) => {
  const path = usePathname();
  const { data: menuList, isSuccess } = useGetAppsMenu();
  const { processId, bucketProcessId } = useIdentity();
  const [{ userData }] = useApp();

  const mapMenuPaths = useCallback((menuItems: any[]): Array<{ id: string; path: string }> => {
    let mappedList: Array<{ id: string; path: string }> = [];

    for (const item of menuItems) {
      if (item.path) {
        mappedList.push({
          id: item.id,
          path: item.path,
        });
      }

      if (item.subMenu && item.subMenu.length > 0) {
        mappedList = mappedList.concat(mapMenuPaths(item.subMenu));
      }
    }

    return mappedList;
  }, []);

  const recordActivity = useCallback(async (
    customParams: UseRecordLogParams
  ): Promise<void> => {
    try {
      const lastPath = getLastPath(path);

      // Get menu code from current path
      const menuCodeList = isSuccess && menuList ? mapMenuPaths(menuList) : [];
      const currentMenu = menuCodeList.find((menu) =>
        menu.id !== 'home' && path.includes(menu.path)
      );
      const menuCode = currentMenu ? currentMenu.id : path;

      // Prepare log data
      const logData = {
        activity: customParams?.activity || '',
        // bucketProcessId: customParams?.bucketProcessId || params?.bucketProcessId || bucketProcessId || processId,
        bucketProcessId: customParams?.bucketProcessId || params?.bucketProcessId || '',
        changeAfter: customParams?.changeAfter || params?.changeAfter || '',
        changeBefore: customParams?.changeBefore || params?.changeBefore || '',
        menuCode: customParams?.menuCode || menuCode || '',
        module: customParams?.module || params?.module || '',
        process: customParams?.process || params?.process || '',
        remarks: customParams?.remarks || params?.remarks || path || '',
      };

      // Make API call to record the log
      await recordLog(logData);
    } catch (error) {
      console.error('Failed recordActivity');
      // Don't throw error to prevent breaking the main functionality
    }
  }, [
    path,
    menuList,
    isSuccess,
    mapMenuPaths,
    bucketProcessId,
    processId,
    params,
    userData?.user?.email || userData?.user?.fullName
  ]);

  return {
    recordActivity,
  };
};

export default useRecordLog;
