'use client';
import React, { useState } from 'react';

import { Collapse, useTheme } from '@mui/material';


import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { SectionTitleOLProps } from './types';


const SectionTitleOL = ({
  title = 'Title',
  subtitle = '',
  isMandatory,
  sx = {},
  children,
  isOpen = false,
  rightComponent,
}: SectionTitleOLProps) => {
  const theme = useTheme();

  const [isExpanded, setIsExpanded] = useState(isOpen);

  return (
    <ColumnWrapper sx={{ width: '100%' }}>
      <RowWrapper
        sx={{
          alignItems: 'center',
          gap: 2,
        }}
      >
        <RowWrapper
          sx={{
            alignSelf: 'flex-end',
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
          <RowWrapper sx={{ alignItems: 'center', gap: 3 }}>
            <TextStyle
              variant="body2"
              fontWeight={600}
              color={theme.palette.custom.gray20}
            >
              {subtitle}
            </TextStyle>
            {children && (
              <Button
                variant="text"
                sx={{
                  alignSelf: 'end',
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

        {rightComponent &&
        <RowWrapper sx={{ flex: 0 }}>
          {rightComponent}
        </RowWrapper>
        }
      </RowWrapper>
      <ColumnWrapper>
        <Collapse in={isExpanded}>
          {children}
        </Collapse>
      </ColumnWrapper>
    </ColumnWrapper>
  );
};

export default SectionTitleOL;
