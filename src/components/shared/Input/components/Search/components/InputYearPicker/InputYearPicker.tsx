'use client';
import React, { useEffect } from 'react';

import { useTheme } from '@mui/material';
import dayjs from 'dayjs';

import Input from '@/components/shared/Input';

import type { InputYearPickerProps } from './InputYearPicker.types';


const InputYearPicker = ({
  label,
  value,
  disabled,
  onChange,
  placeholder = 'YYYY',
}: InputYearPickerProps) => {
  const theme = useTheme();

  const inputSx = {
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '.MuiIconButton-edgeEnd': { padding: theme.spacing(1) },
    '.MuiInputAdornment-positionEnd': { marginLeft: 0 },
    '.MuiInputBase-input': {
      height: `calc(${theme.typography.body4.fontSize} * ${theme.typography.body4.lineHeight})`,
      padding: theme.spacing(2),
      ...theme.typography.body4,
      fontWeight: 500,
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.custom.gray30,
      borderRadius: theme.radius(1),
    },
  };

  const internalValue = value ? dayjs(value, 'YYYY').format('YYYY') : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string | null) => {
    const raw =
      typeof e === 'string'
        ? e
        : typeof e === 'object' && e?.target
          ? e.target.value
          : '';
    const formatted = raw ? dayjs(raw, 'YYYY').format('YYYY') : null;
    onChange?.(formatted);
  };

  useEffect(() => {
    if (disabled) onChange?.(null);
  }, [disabled]);

  return (
    <Input
      disabled={disabled}
      label={label}
      inputSx={inputSx}
      type="year"
      value={internalValue}
      onChange={handleChange}
      placeholder={placeholder}
      error={false}
      helperText=""
      inputProps={{
        max: 2100,
        min: 1900,
        step: 1,
      }}
    />
  );
};

export default InputYearPicker;
