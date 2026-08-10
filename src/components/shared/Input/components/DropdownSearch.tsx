import { useState } from 'react';

import { useTheme } from '@mui/material';
import MuiAutocomplete from '@mui/material/Autocomplete';

import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';

import TextStyle from '../../TextStyle';

import type { InputProps } from '../Input.types';


const DropdownSearch = ({
  ...props
}: InputProps) => {
  const theme = useTheme();

  const [searchedValue, setSearchedValue] = useState('');
  const {
    disabled,
    dropdownList = [],
    error,
    helperText,
    id,
    inputSx,
    isMandatory,
    label,
    onChange,
    placeholder = 'Select',
    testId,
    value,
  } = props;

  return (
    <MuiAutocomplete
      isOptionEqualToValue={
        (option, value) => option?.id === value.id
      }
      disabled={disabled}
      options={dropdownList}
      autoComplete
      includeInputInList
      value={value}
      noOptionsText={dropdownList ? 'No results found' : 'Start typing to search'}
      onChange={(_, newValue) => {
        onChange(newValue?.value);
      }}
      onInputChange={(_, newInputValue) => {
        setSearchedValue(newInputValue ?? '');
      }}
      sx={{
        '.MuiOutlinedInput-root': {
          padding: 0,
          paddingRight: 0,
        },
      }}
      renderInput={(params) => (
        <Input
          {...params}
          id={id}
          data-testid={testId}
          inputSx={inputSx}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {searchedValue?.length
                  ? params.InputProps.endAdornment
                  : <Icon
                    iconName="search"
                    sx={{
                      position: 'absolute',
                      right: theme.spacing(1),
                    }}
                  />
                }
              </>
            ),
            sx: {
              '.MuiAutocomplete-endAdornment': {
                right: `${theme.spacing(1)} !important`,
                top: '0.2em',
              },
              '.MuiSvgIcon-root': {
                height: theme.spacing(3),
                width: theme.spacing(3),
              },
            },
          }}
          error={error}
          helperText={helperText}
        />
      )}
      renderOption={(props, option, state, ownerState) => (
        <li
          style={{
            borderRadius: theme.radius(1),
            margin: theme.spacing(2),
          }}
          {...props}
        >
          <TextStyle>
            {ownerState.getOptionLabel(option)}
          </TextStyle>
        </li>
      )}
      slotProps={{
        popper: {
          sx: {
            '.MuiAutocomplete-noOptions, .MuiAutocomplete-loading': {
              margin: theme.spacing(2),
              ...theme.typography.body4,
            },
          },
        },
      }}
    />
  );
};

export default DropdownSearch;
