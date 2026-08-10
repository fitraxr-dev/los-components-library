'use client';

import * as React from 'react';

import { useTheme } from '@mui/material';

import Input from '@/components/shared/Input';

import type { InputNumberProps } from './InputNumber.types';


const DIGITS_REGEX = /\D/g;

const InputNumber = ({
  label = '',
  value,
  onChange = () => {},
  disabled = false,
  placeholder = 'Insert a number',
}: InputNumberProps) => {
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

  React.useEffect(() => {
    if (disabled) {
      if (value !== null) onChange?.(null);
      return;
    }
  }, [value, disabled, onChange]);

  return (
    <Input
      label={label}
      type="text"
      regex={DIGITS_REGEX}
      disabled={disabled}
      withSymbols={false}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      inputSx={inputSx}
      inputMode="numeric"
    />
  );
};

export default InputNumber;
