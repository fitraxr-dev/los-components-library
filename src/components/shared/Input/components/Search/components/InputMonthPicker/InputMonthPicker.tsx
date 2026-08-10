'use client';
import React, { useEffect, useRef } from 'react';

import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import Input from '@/components/shared/Input';

import type { InputMonthPickerProps } from './InputMonthPicker.types';


dayjs.extend(customParseFormat);

const InputMonthPicker = ({
  label,
  value,
  disabled,
  onChange,
  placeholder = 'MM/YYYY',
}: InputMonthPickerProps) => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const internalValue = value
    ? (() => {
      const parsed = dayjs(value, 'MM/YYYY', true);
      if (parsed.isValid()) {
        return parsed.format('YYYY-MM');
      }
      return value;
    })()
    : '';

  const handleChange = (e: any) => {
    const raw = typeof e === 'string' ? e : (e?.target?.value ?? '');
    if (!raw) {
      onChange?.('');
      return;
    }
    onChange?.(raw);
  };

  useEffect(() => {
    if (!value && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [value]);

  return (
    <Input
      inputRef={inputRef}
      disabled={disabled}
      label={label}
      inputSx={inputSx}
      type="month"
      value={internalValue}
      onChange={handleChange}
      placeholder={placeholder}
      error={false}
      helperText=""
    />
  );
};

export default InputMonthPicker;
