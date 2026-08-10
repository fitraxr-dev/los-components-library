import React from 'react';

import { useTheme } from '@mui/material';

import TextStyle from '@/components/shared/TextStyle';

import type { SxProps, Theme } from '@mui/material';


const Label = ({ text, sx }: { text: string;sx?: SxProps<Theme> }) => {
  const theme = useTheme();

  return (
    <TextStyle
      width="100%"
      variant="body5"
      weight={500}
      color={theme.palette.primary.main}
      sx={{
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.radius(10),
        display: 'flex',
        maxWidth: '10vw',
        minWidth: '4vw',
        px: '16px',
        py: '4px',
        textAlign: 'center',
        textWrap: 'wrap',
        ...sx,
      }}
    >
      {text}
    </TextStyle>
  );
};

export default Label;
