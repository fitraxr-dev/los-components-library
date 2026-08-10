import React from 'react';

import { useTheme } from '@mui/material';

import TextStyle from '@/components/shared/TextStyle';

import { useBadge } from './Badge.hook';


const Badge = ({ status = 'Draft' }) => {
  const theme = useTheme();
  const { badgeCondition } = useBadge({ status, theme });

  return (
    <TextStyle
      weight="500"
      sx={{
        border: 1,
        borderColor: badgeCondition,
        borderRadius: theme.spacing(10),
        color: badgeCondition,
        padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
      }}
    >
      {status}
    </TextStyle>
  );
};
export default Badge;
