import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { AppsMenuControllerApi } from '@/services/openapi/user-management-service';


const apiNew = new AppsMenuControllerApi();

const publicRoute = ['/login', '/password/create', '/password/forgot'];

const cleanLabelRecursively = (items) => {
  if (!Array.isArray(items)) {
    return items;
  }

  return items.map((item) => {
    const newItem = { ...item };
    if (typeof newItem.label === 'string') {
      newItem.label = newItem.label.replace(/^(-+)\s*/, '');
    }

    if (newItem.subMenu && Array.isArray(newItem.subMenu)) {
      newItem.subMenu = cleanLabelRecursively(newItem.subMenu);
    }
    return newItem;
  });
};

const useGetAppsMenu = () => {
  const pathname = usePathname();
  const query = useQuery({
    enabled: !publicRoute.includes(pathname),
    placeholderData: [{
      'icon': 'home',
      'id': 'home',
      'label': 'Home',
      'path': '/',
    }],
    queryFn: async () => {
      try {
        const res = await apiNew.userPermissionMenuList();

        return res.data.data.contents;

      } catch (error) {
        console.error('Apps menu error: ', error);
        return null;
      }
    },
    queryKey: ['apps-menu'],
    select: (data) => {
      const menuToProcess = data ?? [{
        'icon': 'home',
        'id': 'home',
        'label': 'Home',
        'path': '/',
      }];

      return cleanLabelRecursively(menuToProcess);
    },
  });


  return query;
};


export default useGetAppsMenu;
