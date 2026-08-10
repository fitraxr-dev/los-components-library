import { useContext } from 'react';

import { useTheme } from '@mui/material';

import useCustomRouter from '@/hooks/useCustomRouter';

import { MaintenanceParameterBarContext } from '../../MaintenanceParameterBar.context';


const useBreadCrumb = () => {
  const { state } = useContext(MaintenanceParameterBarContext);
  const { breadCrumb } = state;
  const theme = useTheme();
  const router = useCustomRouter();

  const handleNavigation = (path: string) => {
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
