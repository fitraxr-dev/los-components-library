'use client';
import React from 'react';

import { FormControlLabel, Radio, RadioGroup, useTheme } from '@mui/material';


import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { InputProps } from '../Input.types';


const RadioButton = ({
  ...props
}: InputProps) => {
  const {
    id,
    testId,
    label,
    radioList = [],
    value = '',
    onChange = () => { },
    sx = {},
    sxOptions = {},
    disabled = false,
    position = 'horizontal',
    isMandatory = false,
  } = props;

  const theme = useTheme();

  return (
    <ColumnWrapper sx={{ ...sx }}>
      {label && (
        <TextStyle
          variant="body4"
          weight={600}
          mb={1}
          color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}
          sx={
            isMandatory && {
              ':after': {
                color: 'red',
                content: '"*"',
              },
            }
          }
        >
          {label}
        </TextStyle>
      )}
      <RadioGroup
        id={id}
        data-testid={testId}
        name={props.name || label}
        value={value}
        onChange={onChange}
        sx={{
          display: 'flex',
          flexDirection: position === 'vertical' ? 'column' : 'row',
          ...sxOptions,
        }}
      >
        {radioList.map((option) => (
          <FormControlLabel
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              ...(disabled && {
                color: theme.palette.text.disabled,
              }),
            }}
            control={
              <Radio
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: theme.typography.body4.fontSize,
                  },
                  color: theme.palette.primary.main,
                }}
              />
            }
            key={option.label}
            label={
              <TextStyle variant="body4" weight={600}>
                {option.label}
              </TextStyle>
            }
            value={option.value}
            disabled={disabled}
          />
        ))}
      </RadioGroup>
    </ColumnWrapper>
  );
};

export default RadioButton;
