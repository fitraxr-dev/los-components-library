'use client';
import React from 'react';

import { useTheme } from '@mui/material';


import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { TitleProps } from './types';


const Title = ({
  title = 'Title',
  buttons = [],
  sx = {},
  customRender = null,
}: TitleProps) => {
  const theme = useTheme();

  const renderButtons = () => (
    <RowWrapper>
      {buttons.map((el) => (
        <Button
          key={el.label}
          sx={{ ml: 2, px: 4, py: 1.5 }}
          startIcon={el?.iconName}
          onClick={el.onClick ?? null}
          isLoading={el.isLoading}
          {...(el.disabled && { disabled: true })}
          color={el.color}
        >
          {el.label}
        </Button>
      ))}
    </RowWrapper>
  );

  return (
    <RowWrapper
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        ...sx,
      }}
    >
      <TextStyle
        variant="title1"
        weight={sx?.fontWeight ? sx.fontWeight : 700}
        color={theme.palette.primary.main}
        py={1}
      >
        {title}
      </TextStyle>
      {customRender || (buttons.length ? renderButtons() : null)}
    </RowWrapper>
  );
};

export default Title;
