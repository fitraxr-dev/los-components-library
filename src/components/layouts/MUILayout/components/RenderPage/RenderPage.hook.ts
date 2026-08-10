import { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { extractPaths } from '@/helpers/utils';
import useRoles from '@/hooks/useRoles';
import { useTrackActivity } from '@/hooks/useTrackerActivity';

import useGetAppsMenu from '@/components/pages/UserManagement/AccessMenu/hooks/useGetAccessMenuById';

import { extractedPath } from './RenderPage.constants';


const useRenderPage = () => {
  useTrackActivity();

  const grantedAccess = useRoles();
  const pathname = usePathname();
  const { data: menuList } = useGetAppsMenu();
  const publicRoute = ['/login', '/konoha', '/404', '/password/create', '/password/forgot'];
  const isPathAllowed = useMemo(() => {
    const hasPath = (paths, find) => paths.some((path) => path.includes(find));

    const augmentedMenuList = [
      ...menuList,
      ...extractedPath
        .filter((dt) => hasPath(extractPaths(menuList), dt.from))
        .map((dt) => ({
          icon: '',
          id: '',
          label: '',
          path: dt.path,
        })),
    ];

    //TODO: remove this
    return true;
    // return extractPaths(augmentedMenuList).some((path) =>
    //   path === '/' ? pathname === path : pathname.includes(path)
    // );

  }, [menuList, pathname]);


  return {
    grantedAccess,
    isPathAllowed,
    menuList,
    pathname,
    publicRoute,
  };
};

export default useRenderPage;
