'use client';
import {
  createTheme,
  MenuItem,
  TextField,
  ThemeProvider,
  useTheme,
} from '@mui/material';

import useInput from '../Input.hook';

import type { InputProps } from '../Input.types';


const Dropdown = ({
  ...props
}: InputProps) => {
  const theme = useTheme();
  const { style: defaultStyle } = useInput();
  const {
    disabled,
    dropdownList = [],
    onChange,
    placeholder = 'Select',
    value,
    inputSx,
    inputRef,
    error,
    helperText,
    InputProps,
    selectProps,
    hidePlaceholder = false,
    hasDataMaster,
  } = props;

  let inputValue = value || 'placeholder';
  if (value?.constructor === Array) {
    if (value.at(-1) === '' || value.length === 0) {
      inputValue = ['placeholder'];
    } else {
      inputValue = (value as string[]).filter((str) => str !== 'placeholder');
    }
  }

  const styleDataMaster = {
    backgroundColor: hasDataMaster && '#FCE6E8',
    ...inputSx,
  };

  const styDropdown = {
    ...defaultStyle,
    '.MuiInputBase-input': {
      ...defaultStyle['.MuiInputBase-input'],
      ...(!value && { color: theme.palette.text.disabled }),
      ...(selectProps?.multiple && inputValue.constructor === Array && inputValue[0] === 'placeholder' && { color: theme.palette.text.disabled }),
      // marginRight: '35px !important',
    },
    '.MuiSelect-select': {
      minHeight: '0px !important',
    },
    '.MuiSvgIcon-root': {
      height: theme.spacing(3),
      right: theme.spacing(1),
      top: 'unset',
      width: theme.spacing(3),
    },
    ...styleDataMaster,
  };

  const styMenuItem = { ...theme.typography.body4, fontWeight: 500 };

  const disabledInputProps = disabled ? {
    className: 'Mui-disabled',
    readOnly: true,
  } : {};

  function handleChange(val: any) {
    const dropdownValue = val === 'placeholder' ? '' : val;
    if (dropdownValue.constructor === Array) {
      if (dropdownValue.at(-1) === 'placeholder' || dropdownValue.length === 0) {
        onChange(['']);
      } else {
        onChange(dropdownValue.filter((str) => str !== 'placeholder'));
      }
    } else {
      onChange(dropdownValue);
    }
  }

  const outerTheme = createTheme({
    components: {
      MuiPaper: {
        defaultProps: {
          sx: {
            border: '1px solid #E3E3E3',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
    // Add radius function to theme to avoid error (has no effect)
    radius: function (val: number): string | number {
      throw new Error('Function not implemented.');
    },
  });


  return (
    <ThemeProvider theme={outerTheme}>
      <TextField
        inputRef={inputRef}
        InputProps={{ ...InputProps, ...disabledInputProps }}
        hiddenLabel
        onChange={(e) => handleChange(e.target.value)}
        select
        SelectProps={{ ...selectProps, onChange: (e) => handleChange(e.target.value) }}
        sx={styDropdown}
        value={inputValue}
        error={error}
        helperText={helperText}
      >

        { !hidePlaceholder && (
          <MenuItem
            value="placeholder"
            sx={{ ...styMenuItem, color: theme.palette.custom.gray30 }}
          >
            {placeholder}
          </MenuItem>
        )}

        {dropdownList?.map((option, index) => (
          <MenuItem
            key={index}
            sx={styMenuItem}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </ThemeProvider>
  );
};

export default Dropdown;
