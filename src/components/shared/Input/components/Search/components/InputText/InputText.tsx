'use client';
import React, { useEffect } from 'react';

import { useTheme } from '@mui/material';

import Input from '@/components/shared/Input';

import type { InputTextProps } from './InputText.types';


const InputText = ({
  label,
  data,
  onChange,
  value,
  disabled,
}: InputTextProps) => {
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

  useEffect(() => {
    if (disabled) {
      onChange(null);
    }
  }, [disabled]);

  console.log(value);
  return (
    <Input
      disabled={disabled}
      label={label}
      inputSx={inputSx}
      value={value}
      onChange={onChange}
    />
  );
};

export default InputText;
