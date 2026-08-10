import React, { useMemo } from 'react';

import { Button, useTheme } from '@mui/material';

import IconTooltip from '../IconTooltip';


interface IconButtonProps {
  iconName: string;
  isDisabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  sx?: Record<string, any>;
  sxIcon?: Record<string, any>;
}


const IconButton = ({ isDisabled, iconName, onClick, sx, sxIcon }: IconButtonProps) => {
  const theme = useTheme();
  return (
    <Button
      disabled={isDisabled}
      variant="text"
      sx={{
        minWidth: 0,
        padding: theme.spacing(1),
        ...sx,
      }}
      onClick={onClick}
    >
      <IconTooltip
        iconName={iconName}
        sx={{
          ...sxIcon,
          ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })),
        }}
      />
    </Button>
  );
};

export default IconButton;
