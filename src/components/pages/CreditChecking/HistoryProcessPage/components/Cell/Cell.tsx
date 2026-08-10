'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


type CellProps = {
  content: string | string[];
}
const Cell = ({ content }: CellProps) => {
  const theme = useTheme();
  return (
    <RowWrapper
      sx={{
        borderBottom: '0.5px dashed black',
        gap: 15,
        minHeight: `calc(${theme.typography.button.fontSize} + ${theme.spacing(1)})`,
      }}
    >
      {
        typeof content === 'string' ?
          <TextStyle variant="body5" color="black" weight={600}>
            {content}
          </TextStyle>
          :
          (content.map((item, index) => (
            <TextStyle key={`content-${index + 1}`} variant="body5" color="black" weight={600}>
              {item}
            </TextStyle>
          )))
      }
    </RowWrapper>
  );
};

export default Cell;
