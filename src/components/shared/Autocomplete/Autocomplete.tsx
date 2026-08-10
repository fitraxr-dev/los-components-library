import { useState, useEffect } from 'react';

import { CircularProgress, Grow, Paper, useTheme } from '@mui/material';
import MuiAutocomplete, { createFilterOptions } from '@mui/material/Autocomplete';


import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';

import ColumnWrapper from '../ColumnWrapper';
import TextStyle from '../TextStyle';

import type { AutocompleteOption, AutocompleteProps } from './types';


const Autocomplete = ({
  dropdownList = [],
  inputSx = {},
  label,
  onChange = () => { },
  onInputChange = () => { },
  hasDataMaster,
  ...props
}: AutocompleteProps) => {
  const theme = useTheme();
  const [isSearch, setIsSearch] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const {
    id,
    testId,
    disabled,
    placeholder,
    isMandatory = false,
    isLoading = false,
    value = '',
    color = '',
    error,
    helperText,
    maxLength,
  } = props;

  useEffect(() => {
    if (value && typeof value === 'object' && value.label) {
      setInputValue(value.label);
    } else if (!value || (typeof value === 'object' && !value.label)) {
      setInputValue('');
    }
  }, [value]);

  const styleDataMaster = {
    backgroundColor: hasDataMaster && '#FCE6E8',
    ...inputSx,
  };

  const filterOptions = createFilterOptions<AutocompleteOption>({
    matchFrom: 'any',
    stringify: (option) => option?.label || '',
  });

  return (
    <ColumnWrapper>
      <MuiAutocomplete
        isOptionEqualToValue={
          (option: AutocompleteOption, value: AutocompleteOption) => option?.id === value.id
        }
        getOptionLabel={(option: AutocompleteOption) => option?.label || ''}
        filterOptions={filterOptions}
        disabled={disabled}
        options={dropdownList ?? []}
        autoComplete
        includeInputInList
        value={value}
        inputValue={inputValue}
        onInputChange={(_, newInputValue, reason) => {
          const inputText = newInputValue ?? '';
          setInputValue(inputText);

          if (reason === 'input' || reason === 'clear') {
            onInputChange(inputText);
            if (reason === 'input' && value && typeof value === 'object' && value.id) {
              onChange({ id: '', label: '' });
            } else if (reason === 'clear') {
              onChange({ id: '', label: '' });
            }
          }
          setIsSearch(Boolean(inputText));
        }}
        noOptionsText={dropdownList ? 'No results found' : 'Start typing to search'}
        onChange={(_, newValue: AutocompleteOption) => {
          onChange(newValue ?? { id: '', label: '' });
          if (newValue) {
            setInputValue(newValue.label || '');
          } else {
            setInputValue('');
          }
        }}
        loading={isLoading}
        sx={{
          '.MuiOutlinedInput-root': {
            padding: 0,
            paddingRight: 0,
            ...styleDataMaster,
          },
        }}
        PaperComponent={({ children }) => (
          <Grow
            style={{ transformOrigin: '0 0 0' }}
            {...(children ? { timeout: 1000 } : {})}
            in={Boolean(children)}
            timeout={theme.transitions.duration.short}
          >
            <Paper elevation={6} sx={{ borderRadius: theme.radius(1), boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.5)' }}>
              {children}
            </Paper>
          </Grow>
        )}
        renderInput={(params) => (
          <Input
            {...params}
            id={id}
            data-testid={testId}
            isMandatory={isMandatory}
            label={label}
            placeholder={placeholder}
            color={color}
            autoComplete="off"

            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="primary" size={theme.typography.body3.fontSize} /> : null}
                  {isSearch
                    ? params.InputProps.endAdornment
                    : <Icon
                      iconName="search"
                      sx={{
                        pointerEvents: 'none',
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
              transitionDuration: theme.transitions.easing.easeInOut,
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
      {hasDataMaster &&
        <TextStyle sx={{ pt: 1 }} weight={500}>Data Sebelumnya : {hasDataMaster}</TextStyle>}
    </ColumnWrapper>

  );
};

export default Autocomplete;
