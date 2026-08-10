'use client';
import {
  Autocomplete,
  Chip,
  CircularProgress,
  IconButton,
  useTheme,
} from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input/Input';
import TextStyle from '@/components/shared/TextStyle';

import useMultipleAutoComplete from './MultipleAutoComplete.hook';

import type { InputMultipleAutocompleteProps, MultipleAutocompleteOption } from './MultipleAutoComplete.types';


const MultipleAutoComplete = (props: InputMultipleAutocompleteProps) => {
  const theme = useTheme();
  const {
    label,
    disabled,
    onChange = () => { },
    onOpen,
    value,
    isLoading,
    dropdownList = [],
    id,
    placeholder,
    error,
    helperText,
    withSelectAll = true,
    isMandatory = false,
    onDeleteItem,
    onDeleteAll,
    limitTags,
    hasDataMaster,
    inputSx,
  } = props;

  const { mappedValue, searchedValue, setSearchedValue, isSearchAll, setIsSearchAll, handleToggleCheckbox } =
    useMultipleAutoComplete(props);

  const styleDataMaster = {
    backgroundColor: hasDataMaster && '#FCE6E8',
    ...inputSx,
  };

  return (
    <ColumnWrapper>
      <Autocomplete
        disabled={disabled}
        limitTags={limitTags}
        fullWidth
        multiple
        id={id}
        loading={isLoading}
        isOptionEqualToValue={
          (option: MultipleAutocompleteOption, value: MultipleAutocompleteOption) => option?.value === value?.value
        }
        disableClearable={!!onDeleteAll}
        sx={{
          '.MuiAutocomplete-tag': {
            maxWidth: '100%',
            whiteSpace: 'normal',
          },
          '.MuiOutlinedInput-root': {
            padding: `${theme.spacing(0)}`,
            paddingRight: 0,
            ...styleDataMaster,
          },

        }}
        freeSolo
        value={mappedValue}
        inputValue={searchedValue}
        onOpen={() => {
          onOpen?.();
        }}
        onInputChange={(event, newInputValue) => {
          if (event?.type === 'click') {
            setSearchedValue('');
          } if (event?.type === 'change') {
            setSearchedValue(newInputValue ?? '');
          }
        }}
        onChange={(event, newValue) => {
          const formatMapp = newValue?.map((res) => res.value);
          onChange(formatMapp as string[]);
        }}
        options={dropdownList ?? []}
        getOptionLabel={(option) => option?.label}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { onDelete } = getTagProps({ index });
            return (
              <Chip
                label={option?.label}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  fontSize: '12px',
                  fontWeight: 'medium',
                  height: '2vw',
                  margin: theme.spacing(1),
                }}
                {...getTagProps({ index })}
                key={index}
                onDelete={() => {
                  if (typeof onDeleteItem === 'function') {
                    onDeleteItem(option, onDelete, index);
                  } else {
                    onDelete(option);
                  }
                }}
              />
            );
          }
          )
        }
        renderOption={(props, option, state, ownerState) => {
          return (
            <li
              style={{
                borderRadius: theme.radius(1),
                margin: theme.spacing(2),
              }}
              {...props}
              key={option?.key}
            >
              <TextStyle>
                {ownerState.getOptionLabel(option)}
              </TextStyle>
            </li>
          );
        }
        }
        renderInput={(params) => (
          <Input
            {...params}
            isMandatory={isMandatory}
            id={id}
            label={label}
            placeholder={placeholder}
            topComponent={ withSelectAll ?
              <Input
                type="checkbox"
                checkboxList={[{ label: 'Select All', value: 'checked' }]}
                onChange={(val: string[]) => handleToggleCheckbox(val.includes('checked'))}
                value={isSearchAll ? 'checked' : ''}
                disabled={disabled}
              /> : null
            }
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="primary" size={theme.typography.body3.fontSize} /> : null}
                  {onDeleteAll && value?.length > 0 ? (
                    <IconButton
                      onClick={onDeleteAll}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        color: theme.palette.text.secondary,
                        mr: 1,
                        p: 0,
                      }}
                    >
                      <Icon iconName="close" />
                    </IconButton>
                  ) : (
                    <>{params.InputProps.endAdornment}</>
                  )}
                  {!(value?.length || searchedValue?.length) && (
                    <Icon
                      iconName="search"
                      sx={{
                        position: 'absolute',
                        right: theme.spacing(1),
                      }}
                    />
                  )}
                </>
              ),
              sx: {
                '.MuiAutocomplete-endAdornment': {
                  right: `${theme.spacing(1)} !important`,
                  top: '.2rem',
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

      {hasDataMaster &&
      <TextStyle sx={{ pt: 1 }} weight={500}>Data Sebelumnya : {hasDataMaster}</TextStyle>}
    </ColumnWrapper>

  );
};

export default MultipleAutoComplete;
