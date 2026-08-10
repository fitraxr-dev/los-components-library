'use client';
import React, { useEffect } from 'react';

import { useTheme } from '@mui/material';

import Input from '@/components/shared/Input';

import type { InputSelectProps } from './InputSelect.types';


const InputSelect = ({ label, data, onChange, value, disabled }: InputSelectProps) => {
  const theme = useTheme();

  const inputSx = {
    '.MuiInputBase-input': {
      height: `calc(${theme.typography.body4.fontSize} * ${theme.typography.body4.lineHeight})`,
      padding: theme.spacing(2),
      ...theme.typography.body4,
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderRadius: theme.radius(0.5),
    },
  };

  useEffect(() => {
    if (disabled) {
      onChange(null);
    }
  }, [disabled]);

  return (
    <Input
      label={label}
      disabled={disabled}
      inputSx={inputSx}
      dropdownList={[
        ...data,
      ]}
      type="dropdown"
      onChange={onChange}
      value={value ?? 'placeholder'}
      placeholder="Select One"
    />
  );
};

export default InputSelect;
