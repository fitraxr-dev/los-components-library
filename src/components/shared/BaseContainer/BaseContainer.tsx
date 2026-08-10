'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';
import Paper from '@mui/material/Paper';

import type { BaseContainerProps } from './types';


const BaseContainer = ({
  backgroundColor = '',
  sx = {},
  children = null,
}: BaseContainerProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        alignSelf: 'stretch',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        maxHeight: '100%',
      }}
    >
      <Paper
        sx={{
          borderRadius: theme.radius(1),
          boxShadow: 1,
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          maxHeight: '100%',
          px: 4,
          py: 2,
          ...(backgroundColor && { backgroundColor }),
          ...sx,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default BaseContainer;
