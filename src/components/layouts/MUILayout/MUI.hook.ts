import { useEffect, useMemo } from 'react';

import { createTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { darkTheme } from '@/helpers/theme/dark';
import { lightTheme } from '@/helpers/theme/light';
import useApp from '@/hooks/useApp';


const useMUI = () => {
  const [state] = useApp();
  const { darkMode } = state;
  const pathName = usePathname();

  const colorMode = darkMode ? 'dark' : 'light';
  const theme = useMemo(
    () => createTheme(darkMode ? darkTheme : lightTheme),
    [darkMode],
  );

  console.log('APP STATE:', state);

  // auto scroll to top when route change
  // If this code effect is not needed, you can remove it
  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }, [pathName]);

  return {
    colorMode,
    theme,
  };
};

export default useMUI;
