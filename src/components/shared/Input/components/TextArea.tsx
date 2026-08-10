'use client';
import { TextField, useTheme } from '@mui/material';

import useInput from '../Input.hook';

import type { InputProps } from '../Input.types';


const TextArea = ({
  ...props
}: InputProps) => {
  const theme = useTheme();
  const { style } = useInput();
  const {
    disabled,
    onChange,
    placeholder = 'Input keterangan',
    value,
    maxLength,
    inputRef,
    error,
    helperText,
    rows,
    inputProps,
    inputSx,
    hasDataMaster,
    color,
    minRows = 1,
  } = props;
  const styleDataMaster = {
    backgroundColor: hasDataMaster && '#FCE6E8',
    ...inputSx,
  };

  const styTextArea = {
    fontWeight: 500,
    lineHeight: 1.2,
    ...theme.typography.body4,
    ...style,
    ...styleDataMaster,
    '.MuiInputBase-inputMultiline': {
      padding: '0 !important',
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderRadius: theme.radius(1),
    },
    flex: 'unset !important',
  };

  const disabledInputProps = disabled ? {
    className: 'Mui-disabled',
    readOnly: true,
  } : {};

  const htmlInputProps = {
    ...inputProps,
    ...(maxLength ? { maxLength } : {}),
  };

  function handleChange(val: string) {
    const inputValue = val;
    onChange(inputValue);
  }

  return (
    <TextField
      inputRef={inputRef}
      inputProps={htmlInputProps}
      InputProps={disabledInputProps}
      focused={false}
      hiddenLabel
      multiline
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      sx={styTextArea}
      value={value ?? ''}
      error={error}
      helperText={helperText}
      minRows={minRows}
    />
  );
};

export default TextArea;
