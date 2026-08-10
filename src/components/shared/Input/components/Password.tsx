'use client';
import { useState } from 'react';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';

import useInput from '../Input.hook';

import type { InputProps } from '../Input.types';


const Password = ({
  ...props
}: InputProps) => {
  const {
    color,
    iconColor = 'white',
    disabled,
    error,
    helperText,
    inputRef,
    maxLength,
    onChange,
    onKeyDown,
    placeholder = 'example: proses..',
    value,
    id,
    autoComplete,
    inputProps,
  } = props;

  const { style } = useInput(color);

  const [showPassword, setShowPassword] = useState(false);

  function handleChange(val: string) {
    const inputValue = val;
    onChange(inputValue);
  }

  const componentInputProps = {
    ...inputProps,
    ...(maxLength ? { maxLength } : {}),
  };

  return (
    <>
      <TextField
        id={id}
        inputRef={inputRef}
        inputProps={componentInputProps}
        disabled={disabled}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        sx={style}
        value={value}
        error={error}
        type={showPassword ? 'text' : 'password'}
        helperText={helperText}
        onKeyDown={onKeyDown}
        InputProps={
          {
            autoComplete: autoComplete,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {!showPassword
                    ? <VisibilityOff color={iconColor} />
                    : <Visibility color={iconColor} />}
                </IconButton>
              </InputAdornment>
            ),
          }
        }

      />
    </>
  );
};

export default Password;
