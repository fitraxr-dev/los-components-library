'use client';
import React, { useMemo } from 'react';

import { useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { InputTextRangeProps } from './InputTextRange.types';


const InputTextRange = ({
  label = '',
  startValue,
  endValue,
  onChange = () => { },
  disabled = false,
  placeholder1 = 'Insert Start Period',
  placeholder2 = 'Insert End Period',
}: InputTextRangeProps) => {
  const theme = useTheme();

  const inputSx = {
    '.MuiIconButton-edgeEnd': {
      padding: theme.spacing(1),
    },
    '.MuiInputAdornment-positionEnd': {
      marginLeft: 0,
    },
    '.MuiInputBase-input': {
      height: `calc(${theme.typography.body4.fontSize} * ${theme.typography.body4.lineHeight})`,
      padding: theme.spacing(2),
      ...theme.typography.body4,
      fontWeight: 500,
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderRadius: theme.radius(1),
    },
  };

  const handleChangePeriod = (type, value) => {
    onChange({
      end: type === 'end' ? value : (endValue ?? null),
      start: type === 'start' ? value : (startValue ?? null),
    });
  };

  useMemo(() => {
    if (disabled) {
      onChange({
        end: 0,
        start: 0,
      });
    }
  }, [disabled]);

  const regex = /^\s|[^\d]/g;

  const isPresent = (v: unknown) => v !== null && v !== undefined && v !== '';
  const hasStart = isPresent(startValue);
  const hasEnd = isPresent(endValue);
  const startNum = hasStart ? Number(startValue) : NaN;
  const endNum = hasEnd ? Number(endValue) : NaN;

  return (
    <ColumnWrapper>
      <TextStyle
        variant="body4"
        weight={500}
        mb={1}
        color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}
      >
        {label}
      </TextStyle>
      <RowWrapper sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
        <Input
          regex={regex}
          disabled={disabled}
          withSymbols={false}
          value={startValue}
          placeholder={placeholder1}
          onChange={(val) => handleChangePeriod('start', val)}
          error={hasStart && hasEnd && startNum > endNum}
          inputSx={inputSx}
        />
        <Icon iconName="arrow-right" textVariant="body4" />
        <Input
          regex={regex}
          disabled={disabled}
          withSymbols={false}
          value={endValue}
          placeholder={placeholder2}
          onChange={(val) => handleChangePeriod('end', val)}
          error={hasStart && hasEnd && startNum > endNum}
          inputSx={inputSx}
        />
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default InputTextRange;
