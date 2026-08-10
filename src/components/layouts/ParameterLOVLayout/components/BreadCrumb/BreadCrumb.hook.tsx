import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import useCustomRouter from '@/hooks/useCustomRouter';


const useBreadCrumb = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useCustomRouter();

  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Home', url: '/' }
    ];

    if (pathname.includes('/parameter-lov')) {
      items.push({ label: 'Parameter LOV', url: '/master-parameter/parameter-lov' });
    }

    if (pathname.includes('/detail/')) {
      items.push({ label: 'Detail', url: '' });
    }

    if (pathname.includes('/edit/')) {
      items.push({ label: 'Edit', url: '' });
    }

    if (pathname.includes('/create')) {
      items.push({ label: 'Create', url: '/master-parameter/parameter-lov/create' });
    }

    return items;
  };

  const breadCrumb = getBreadcrumbItems();

  const handleNavigation = (url?: string) => {
    if (url) router.push(url);
  };

  return { breadCrumb, handleNavigation, theme };
};

export default useBreadCrumb;
