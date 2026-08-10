'use client';

import * as React from 'react';

import { Box, Collapse, Tooltip, useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { SectionTitleProps } from './types';


const SectionTitle = ({
  title = 'Title',
  subtitle = '',
  isMandatory,
  sx = {},
  tooltipText,
  children,
  isOpen = false,
  hideToggle = false,
  buttons = [],
  rightComponent = null,
}: SectionTitleProps) => {
  const theme = useTheme();

  const [isExpanded, setIsExpanded] = React.useState(isOpen);

  const renderButtons = React.useMemo(() => (
    <RowWrapper>
      {buttons.map((el) => (
        <Button
          key={el.label}
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
  ), [buttons]);

  return (
    <ColumnWrapper sx={{ width: '100%' }}>
      <RowWrapper gap={1}>
        <RowWrapper
          sx={{
            alignItems: 'center',
            border: 1,
            borderColor: theme.palette.primary.main,
            borderRadius: theme.radius(1),
            flex: 1,
            justifyContent: 'space-between',
            px: 3,
            py: 1.5,
            ...sx,
          }}
        >
          <Box display="inline-flex" alignItems="center" gap={2}>
            <TextStyle
              variant="title1"
              fontWeight={700}
              color={theme.palette.primary.main}
            >
              {title}
              <span style={{ color: theme.palette.error.main }}>
                {isMandatory ? '*' : ''}
              </span>
            </TextStyle>

            {tooltipText && (
              <Tooltip
                title={
                  <Box sx={{ margin: '-10px 0 -10px -10px' }}>
                    <TextStyle variant="body6">
                      <ul><li>{tooltipText}</li></ul>
                    </TextStyle>
                  </Box>
                }
                placement="right"
                slotProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff',
                    },
                  },
                }}
              >
                <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
                  <Icon iconName="tooltip-info" />
                </Box>
              </Tooltip>
            )}
          </Box>

          <RowWrapper sx={{ alignItems: 'center', gap: 3 }}>
            <TextStyle
              variant="body2"
              fontWeight={600}
              color={theme.palette.custom.gray20}
            >
              {subtitle}
            </TextStyle>
            {buttons.length >= 1 && renderButtons}
            {children && !hideToggle && (
              <Button
                variant="text"
                sx={{
                  minWidth: theme.spacing(3),
                  padding: theme.spacing(0),
                }}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Icon
                  textVariant="title1"
                  iconName={isExpanded ? 'arrow-square-up' : 'arrow-square-down'}
                  sx={{
                    path: {
                      fill: theme.palette.primary.main,
                    },
                  }}
                />
              </Button>
            )}
          </RowWrapper>
        </RowWrapper>
        {rightComponent}
      </RowWrapper>

      <Collapse in={isExpanded}>
        {children}
      </Collapse>
    </ColumnWrapper>
  );
};

export default SectionTitle;
