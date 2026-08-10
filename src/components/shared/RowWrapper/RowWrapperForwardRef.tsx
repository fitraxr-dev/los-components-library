'use client';
import React, { forwardRef } from 'react';

import { Box } from '@mui/material';

import type { RowWrapperProps } from './types';

// versi yang bisa terima ref
const RowWrapperForwardRef = forwardRef<HTMLDivElement, RowWrapperProps>(
  ({ children, sx = {}, ...rest }, ref) => (
    <Box
      ref={ref}
      sx={{ display: 'flex', flexDirection: 'row', ...sx }}
      {...rest}
    >
      {children}
    </Box>
  )
);

RowWrapperForwardRef.displayName = 'RowWrapperForwardRef';

export default RowWrapperForwardRef;
