'use client';
import React, { useEffect } from 'react';

import { useTheme } from '@mui/material';

import Input from '@/components/shared/Input';

import type { InputDateProps } from './InputDate.types';


const InputDate = ({
  label,
  data,
  onChange,
  value,
  disabled,
  maxDate,
  minDate,
}: InputDateProps) => {
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

  return (
    <Input
      disabled={disabled}
      label={label}
      inputSx={inputSx}
      type="date"
      value={value}
      onChange={onChange}
      {...(maxDate && { maxDate })}
      {...(minDate && { minDate })}
    />
  );
};

export default InputDate;
