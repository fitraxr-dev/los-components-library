'use client';
import React from 'react';

import Typography from '@mui/material/Typography';

import type { TextStyleProps } from './types';


const TextStyle = ({
  children = '',
  color = '',
  sx = {},
  variant = 'body4',
  weight = 400,
  ...rest
}: TextStyleProps) => (
  <Typography
    variant={variant}
    sx={{
      // overflowWrap: 'anywhere',
      whiteSpace: 'pre-line',
      // wordBreak: 'break-word',
      ...(weight && { fontWeight: weight }),
      ...(color && { color }),
      ...sx,
    }}
    {...rest}
  >
    {children}
  </Typography>
);

export default TextStyle;
