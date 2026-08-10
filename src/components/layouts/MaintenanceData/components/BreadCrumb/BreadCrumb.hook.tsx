import { useTheme } from '@mui/material';

import useCustomRouter from '@/hooks/useCustomRouter';

import { useMaintenanceDataContext } from '../../MaintenanceData.context';


const useBreadCrumb = () => {
  const { breadCrumb } = useMaintenanceDataContext();
  const theme = useTheme();
  const router = useCustomRouter();

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
