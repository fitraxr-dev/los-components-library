'use client';
import React from 'react';

import { Box } from '@mui/material';

import type { RowWrapperProps } from './types';


const RowWrapper = ({
  children,
  sx = {},
  ...rest
}: RowWrapperProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'row', ...sx }} {...rest}>
    {children}
  </Box>
);

export default RowWrapper;
