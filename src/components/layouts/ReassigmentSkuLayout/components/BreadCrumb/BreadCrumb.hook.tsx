import { useEffect } from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import useCustomRouter from '@/hooks/useCustomRouter';

import { useReassignmentSkuContext } from '../../Reassignment.context';


const useBreadCrumb = () => {
  const { breadCrumb, handleSetBreadcrumb } = useReassignmentSkuContext();
  const theme = useTheme();
  const router = useCustomRouter();
  const pathname = usePathname();

  const generateBreadcrumb = () => {
    const paths = pathname.split('/').filter((path) => path);
    const breadcrumbItems = [];

    breadcrumbItems.push({
      label: 'Home',
      url: '/',
    });


    // Handle different paths
    if (paths.length > 1) {
      const moduleIndex = paths[0];
      const processId = paths[1];
      const mode = paths[2];
      const type = paths[3];


      const moduleLabels = {
        'approval': 'Approval',
        'monitoring': 'Monitoring',
      };


      const modeLabels = {
        'create': 'Add New',
        'detail': 'Detail',
        'edit': 'Edit',
        'view': 'View',
      };

      const typeLabels = {
        'request': 'Request',
        'validation': 'Validasi',
      };

      if (moduleIndex && !processId && !mode && !type) {
        breadcrumbItems.push({
          label: moduleLabels[moduleIndex] || moduleIndex,
          url: `/reassignment-sku/${moduleIndex}`,
        });
      }

      else if (moduleIndex && processId && mode && type) {
        breadcrumbItems.push({
          label: moduleLabels[moduleIndex] || moduleIndex,
          url: `/reassignment-sku/${moduleIndex}`,
        });

        breadcrumbItems.push({
          label: modeLabels[mode] || mode,
          url: null,
        });

        breadcrumbItems.push({
          label: typeLabels[type] || type,
          url: null,
        });
      }
    }

    return breadcrumbItems;
  };
  useEffect(() => {
    const newBreadcrumb = generateBreadcrumb();
    handleSetBreadcrumb(newBreadcrumb.slice(2));
  }, [pathname]);

  const handleNavigation = (path) => {
    if (path) {
      router.push(path);
    }
  };

  return {
    breadCrumb,
    handleNavigation,
    theme,
  };
};

export default useBreadCrumb;
