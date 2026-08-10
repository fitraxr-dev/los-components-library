'use client';
import React, { useState, useEffect } from 'react';

import { Collapse, useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


interface SectionTitleProps {
  title?: string;
  subtitle?: string;
  isMandatory?: boolean;
  sx?: object;
  children?: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

const SectionTitle = ({
  title = 'Title',
  subtitle = '',
  isMandatory,
  sx = {},
  children,
  isOpen = false,
  onToggle,
}: SectionTitleProps) => {
  const theme = useTheme();

  const [isExpanded, setIsExpanded] = useState(isOpen);

  // Update isExpanded when isOpen prop changes
  useEffect(() => {
    setIsExpanded(isOpen);
  }, [isOpen]);

  // Handle toggle - use external onToggle if provided, otherwise use internal state
  const handleToggle = () => {
    if (onToggle) {
      onToggle(); // Use external toggle handler
    } else {
      setIsExpanded(!isExpanded); // Use internal state
    }
  };

  return (
    <ColumnWrapper sx={{ width: '100%' }}>
      <RowWrapper
        sx={{
          alignItems: 'center',
          border: 1,
          borderColor: theme.palette.primary.main,
          borderRadius: theme.radius(1),
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
              onClick={handleToggle}
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
      <Collapse in={isExpanded}>
        {children}
      </Collapse>
    </ColumnWrapper>
  );
};

export default SectionTitle;
