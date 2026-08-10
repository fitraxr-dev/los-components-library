'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import Button from '@/components/shared/Button';

import type { BackButtonProps } from './types';


const BackButton = ({
  label = 'Back',
  handleClick = () => { },
  iconName = 'back',
}: BackButtonProps) => {
  const theme = useTheme();

  return (
    <Button
      variant="text"
      textVariant="body3"
      textWeight={700}
      onClick={handleClick}
      startIcon={iconName}
      sx={{
        '&.MuiButtonBase-root:hover': {
          bgcolor: 'transparent',
        },
        mb: theme.spacing(2),
        p: 0,
      }}
    >
      {label}
    </Button>
  );
};

export default BackButton;
