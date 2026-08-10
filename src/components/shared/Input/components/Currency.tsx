'use client';
import { TextField } from '@mui/material';

import useInput from '../Input.hook';

import type { InputProps } from '../Input.types';


const Currency = ({
  ...props
}: InputProps) => {
  const { style } = useInput();
  const {
    disabled,
    onChange,
    placeholder = 'example: 1,000,000',
    value,
    inputRef,
    error,
    helperText,
    maxLength,
    maxDecimal = 2,
    InputProps,
  } = props;

  const disabledInputProps = disabled ? {
    className: 'Mui-disabled',
    readOnly: true,
  } : {};

  function formatValue(inputValue) {
    const inputNumber = (typeof(inputValue) === 'number' ? inputValue.toString() : inputValue)
      ?.replace(/[^\d.]|(\.(?=.*\.))/g, '') ?? '';

    let [wholePart, decimalPart = ''] = inputNumber.split('.');

    if (wholePart.length === 2) {
      wholePart = wholePart.replace(/^0/, '');
    }

    if (maxLength && wholePart.length > maxLength) {
      wholePart = wholePart.substring(0, maxLength);
    }

    if (decimalPart.length > maxDecimal) {
      decimalPart = decimalPart.substring(0, maxDecimal);
    }

    const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedValue = /\./.test(inputNumber)
      ? `${formattedWholePart}.${decimalPart}`
      : formattedWholePart;

    return formattedValue;
  }

  function handleChange(val: string) {
    const inputValue = val;
    const formattedValue = formatValue(inputValue);
    onChange(formattedValue);
  }

  return (
    <TextField
      inputRef={inputRef}
      InputProps={{ ...InputProps, ...disabledInputProps }}
      hiddenLabel
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      sx={style}
      value={formatValue(value as string)}
      error={error}
      helperText={helperText}
    />
  );
};

export default Currency;
