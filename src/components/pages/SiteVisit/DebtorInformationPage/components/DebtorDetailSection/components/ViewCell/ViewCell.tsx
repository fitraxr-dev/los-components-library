'use client';
import React, { useCallback } from 'react';

import { Grid, useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import TextStyle from '@/components/shared/TextStyle';

import type { ViewCellProps } from './ViewCell.types';


const ViewCell = ({
  title = '',
  value = '',
  url = '',
  buttons = [],
  bottomBorder = 'dashed',
  bottomBorderColor = '#000000',
  titleColor = '#000000',
  sx = {},
  sxLabel = {},
  sxValue = {},
}: ViewCellProps) => {
  const theme = useTheme();

  const renderButtons = useCallback(
    () =>
      buttons.map((el, index) => (
        <Button
          key={index}
          startIcon={el?.iconName}
          startIconSx={{ marginRight: el?.label ? theme.spacing(1) : 0 }}
          onClick={el?.action}
          sx={{
            marginLeft: theme.spacing(2),
            minWidth: 0,
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingTop: theme.spacing(1),
          }}
        >
          {el?.label}
        </Button>
      )),
    [theme, buttons],
  );

  if (title === null) return null;

  return (
    <Grid
      container
      spacing={0}
      sx={{
        borderBottom: '0.5px',
        borderColor: bottomBorderColor,
        borderLeft: 0,
        borderRight: 0,
        borderStyle: bottomBorder,
        borderTop: 0,
        justifyContent: 'space-between',
        minHeight: `calc(${theme.typography.button.fontSize} + ${theme.spacing(
          2,
        )})`,
        ...sx,
      }}
    >
      <Grid
        item
        sx={{
          alignItems: 'center',
          display: 'flex',
          px: theme.spacing(1),
          width: '12vw',
          ...(sxLabel),
        }}
      >
        <TextStyle variant="body3" color={titleColor}>
          {title}
        </TextStyle>
      </Grid>
      <Grid item sx={{ alignItems: 'start', display: 'flex', flexDirection: 'row', ...(sxValue) }} xs>
        <TextStyle
          variant="body3"
          color={titleColor}
        >
          {title ? ':' : ''}
        </TextStyle>
        <TextStyle
          variant="body3"
          color={titleColor}
          sx={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: '5',
            display: '-webkit-box',
            maxWidth: '350px',
            ml: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordWrap: 'break-word',
            ...(url && {
              textDecoration: 'underline',
            }),
          }}
          onClick={() => {
            if (url) {
              window.open(url, url);
            }
          }}
        >
          {value}
        </TextStyle>
      </Grid>
      {buttons.length > 0 && (
        <Grid item xs sx={{ display: 'flex', justifyContent: 'end' }}>
          {renderButtons()}
        </Grid>
      )}
    </Grid>
  );
};

export default ViewCell;
