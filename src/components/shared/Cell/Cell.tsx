'use client';
import { useCallback } from 'react';

import { Box, Grid, useTheme } from '@mui/material';

import Autocomplete from '@/components/shared/Autocomplete';
import Icon from '@/components/shared/Icon';
import TextStyle from '@/components/shared/TextStyle';

import { styCellContainer, styText, styTitle } from './styles';

import type { CellProps } from './types';


const Cell = ({
  title = '',
  titleNode,
  value = '',
  type = 'text',
  options = {},
  isMandatory = false,
  buttons = [],
  autoCompleteOptions,
  wrapText = true,
  maxLines,
  hasDataMaster,
}: CellProps) => {
  const theme = useTheme();

  const sx = {
    bottomBorder: 'dashed',
    bottomBorderColor: '#000000',
    titleColor: '#000000',
    ...options,
  };

  const renderButtons = useCallback(
    () => buttons.map((el, index) => (
      <Box key={index} sx={{ alignItems: 'center', cursor: `${el.disabled ? 'auto' : 'pointer'}`, display: 'flex' }} onClick={el.action}>
        <Icon
          sx={el.disabled ?
            {
              'path': {
                stroke: '#ABABAB',
              },
            } : {}
          }
          iconName={el.iconName}
          textVariant="title1"
        />
      </Box>
    )),
    [theme, buttons],
  );

  const hasTitle = Boolean(title || titleNode);

  const renderColon = hasTitle ? (
    <TextStyle
      variant="body3"
      color={sx.titleColor}
    >
      :
    </TextStyle>
  ) : null;

  const styleDataMaster = {
    backgroundColor: hasDataMaster && '#FCE6E8',
    borderRadius: hasDataMaster && '4px',
    padding: hasDataMaster && theme.spacing(1),
  };

  const renderText = (
    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', ml: 1 }}>
      <Box sx={styleDataMaster}>
        <TextStyle
          variant="body3"
          color={sx.titleColor}
          sx={{
            ...styText(type),
            ml: 0,
            ...(wrapText
              ? {
                display: 'block',
                lineHeight: '1.4',
                overflow: 'visible',
                whiteSpace: 'normal',
                width: '100%',
                wordWrap: 'break-word',
                ...(maxLines && {
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: maxLines,
                  display: '-webkit-box',
                  overflow: 'hidden',
                }),
              }
              : {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }
            ),
          }}
          onClick={() => type === 'link' ? window.open(value.text, value.url) : undefined}
        >
          {value}
        </TextStyle>
      </Box>
      {hasDataMaster &&
        <TextStyle sx={{ pt: 1 }} weight={500}>Data Sebelumnya : {hasDataMaster}</TextStyle>}
    </Box>
  );

  const renderAutocomplete = (
    <Box sx={{ mb: 1, ml: 1, width: '100%' }}>
      <Autocomplete
        id="autocomplete"
        testId="autocomplete"
        {...autoCompleteOptions?.input}
      />
    </Box>
  );

  const cellType = {
    'autocomplete': renderAutocomplete,
    'text': renderText,
  };

  const renderValue = cellType[type];


  return (
    <Grid
      container
      spacing={0}
      sx={{
        ...styCellContainer(theme, sx),
        alignItems: wrapText ? 'flex-start' : 'center',
      }}
    >
      <Grid
        item
        sx={{
          ...styTitle(theme),
          alignItems: wrapText ? 'flex-start' : 'center',
        }}
      >
        {titleNode ? (
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            {titleNode}
            {isMandatory ?
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle> : null}
          </Box>
        ) : (
          <>
            <TextStyle
              variant="body4"
              color={sx.titleColor}
              weight={500}
              sx={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            >
              {title}
            </TextStyle>
            {isMandatory ?
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle> : null}
          </>
        )}
      </Grid>
      <Grid
        item
        sx={{
          alignItems: wrapText ? 'flex-start' : 'center',
          display: 'flex',
        }}
        xs
      >
        {renderColon}
        {renderValue}
      </Grid>
      {buttons.length > 0 && (
        <Grid
          item
          xs="auto"
          sx={{
            alignItems: wrapText ? 'flex-start' : 'center',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          {renderButtons()}
        </Grid>
      )}
    </Grid>
  );
};

export default Cell;
