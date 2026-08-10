'use client';
import { TextField } from '@mui/material';

import useInput from '../Input.hook';

import type { InputProps } from '../Input.types';


const TextInput = ({
  ...props
}: InputProps) => {
  const {
    color,
    disabled,
    error,
    helperText,
    inputRef,
    maxLength,
    onChange,
    onKeyDown,
    placeholder = 'example: proses..',
    value,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    // Used in Autocompelte
    id,
    InputLabelProps,
    InputProps,
    inputProps,
    regex = /^\s|[^\w\d.,()_\s-@]/g,
    withSymbols = true,
    hasDataMaster,
  } = props;


  const { style } = useInput(color);

  function formatValue(inputValue: string) {
    const formattedValue = withSymbols ? inputValue : inputValue?.replace(regex, '');
    return formattedValue;
  }

  function handleChange(inputValue: string) {
    const formattedValue = formatValue(inputValue);

    if (onChange) { // Autocomplete component might not pass onChange props
      onChange(formattedValue);
    }
  }

  const styleDataMaster = {
    backgroundColor: hasDataMaster && '#FCE6E8',
  };

  const disabledInputProps = disabled ? {
    className: 'Mui-disabled',
    readOnly: true,
  } : {};

  const componentInputProps = {
    ...inputProps,
    ...(maxLength ? { maxLength } : {}),
    ...(hasDataMaster ? { style: { ...styleDataMaster, ...inputProps?.style } } : {}),

  };

  return (
    <TextField
      id={id}
      InputLabelProps={InputLabelProps}
      InputProps={{ ...InputProps, ...disabledInputProps }}
      inputRef={inputRef}
      inputProps={componentInputProps}
      hiddenLabel
      onChange={(e) => handleChange(e.target.value)}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      placeholder={placeholder}
      onBlur={onBlur}
      sx={style}
      value={value ?? ''}
      error={error}
      helperText={helperText}
      autoComplete={props.autoComplete}
    />
  );
};

export default TextInput;
