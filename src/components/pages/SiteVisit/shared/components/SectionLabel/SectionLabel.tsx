'use client';;
import { useTheme } from '@mui/material';


import TextStyle from '@/components/shared/TextStyle';

import type { SectionLabelProps } from './types';


const SectionLabel = ({
  title = 'Title',
}: SectionLabelProps) => {
  const theme = useTheme();

  return (
    <TextStyle
      variant="title2"
      weight={700}
      color={theme.palette.primary.main}
      py={1}
    >
      {title}
    </TextStyle>
  );
};

export default SectionLabel;
