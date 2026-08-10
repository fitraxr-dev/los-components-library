'use client';
import { useCallback, useMemo } from 'react';

import { useTheme } from '@mui/material';
import MuiSvgIcon from '@mui/material/SvgIcon';

import type { IconProps } from './types';

// Cache for loaded icons to prevent repeated require calls
const iconCache = new Map<string, any>();

const Icon = ({
  iconName,
  textVariant = 'body1',
  sx = {},
}: IconProps) => {
  const theme = useTheme();

  const loadIcon = useCallback((name: string) => {
    // Handle empty or undefined icon names
    if (!name || name.trim() === '') {
      return null;
    }

    // Check cache first
    if (iconCache.has(name)) {
      return iconCache.get(name);
    }

    try {
      // Stubbing dynamic require to prevent Turbopack build errors in catalogue
      return null;
    } catch (error) {
      return null;
    }
  }, []);

  const IconComponent = useMemo(() => {
    if (!iconName) return null;
    return loadIcon(iconName);
  }, [iconName, loadIcon]);

  // Don't render if no icon component is available
  if (!IconComponent) {
    return null;
  }

  return (
    <MuiSvgIcon
      sx={{
        fill: 'none',
        fontSize: theme.typography[textVariant].fontSize,
        ...sx,
      }}
      inheritViewBox
      component={IconComponent}
    />
  );
};

export default Icon;
