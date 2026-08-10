import { Autocomplete, Chip, CircularProgress, useTheme } from '@mui/material';

import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input/Input';
import TextStyle from '@/components/shared/TextStyle';

import type { MultiSelectAutoCompleteProps } from './MultiSelectAutoComplete.types';


const MultiSelectAutoComplete: React.FC<MultiSelectAutoCompleteProps> = (props) => {
  const theme = useTheme();
  const {
    label,
    disabled,
    onChange = () => { },
    value,
    isLoading,
    dropdownList = [],
    id,
    placeholder,
    error,
    helperText,
    withSelectAll = true,
    isMandatory = false,
    sx,
  } = props;

  return (
    <Autocomplete
      disabled={disabled}
      fullWidth
      multiple
      id={id}
      loading={isLoading}
      getOptionLabel={(option) => option.label}
      sx={{
        ...sx,
        '.MuiOutlinedInput-root': {
          padding: `${theme.spacing(1)}`,
          paddingRight: 0,
        },
        '.MuiTextField-root': {
          maxHeight: '10vw',
          overflowY: 'scroll',
        },
      }}
      freeSolo
      value={value}
      options={dropdownList ?? []}
      onChange={(_, newValue) => onChange(newValue)}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            sx={{
              backgroundColor: theme.palette.white.main,
              border: 1,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            }}
            label={option?.label}
            {...getTagProps({ index })}
            key={index}
          />
        ))
      }
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
      renderInput={(params) => (
        <Input
          {...params}
          isMandatory={isMandatory}
          id={id}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="primary" size={theme.typography.body3.fontSize} /> : null}
                {
                  value?.length
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
                top: '11px',
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

export default MultiSelectAutoComplete;
