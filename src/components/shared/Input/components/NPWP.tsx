'use client';
import { TextField } from '@mui/material';

import useInput from '../Input.hook';

import type { InputProps } from '../Input.types';


const NPWP = ({
  ...props
}: InputProps) => {
  const { style } = useInput();
  const {
    disabled,
    onChange,
    placeholder = 'Input NPWP',
    value,
    inputRef,
    error,
    helperText,
    hasDataMaster,
    inputProps,
  } = props;

  const styleDataMaster = {
    backgroundColor: hasDataMaster && '#FCE6E8',
  };

  const disabledInputProps = disabled ? {
    className: 'Mui-disabled',
    readOnly: true,
    ...(hasDataMaster ? { style: { ...styleDataMaster, ...inputProps?.style } } : {}),
  } : {};

  function handleChange(val: string) {
    const digitsOnly = val.replace(/\D/g, '');
    if (digitsOnly.length <= 16) {
      onChange(digitsOnly);
    }
  }

  return (
    <TextField
      inputRef={inputRef}
      InputProps={disabledInputProps}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      sx={style}
      value={value}
      error={error}
      helperText={helperText}
    />
  );
};

export default NPWP;
