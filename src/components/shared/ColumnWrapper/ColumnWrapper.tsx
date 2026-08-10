'use client';
import React from 'react';

import { Box } from '@mui/material';

import type { ColumnWrapperProps } from './types';


const ColumnWrapper = ({ children, sx = {}, ...rest }: ColumnWrapperProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }} {...rest}>
    {children}
  </Box>
);

export default ColumnWrapper;
