import React from 'react';

import { InputAdornment, InputBase, Popover } from '@mui/material';

import Icon from '@/components/shared/Icon';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';

import PopupFilter from './components/PopupFilter';
import useSearch from './Search.hook';

import type { SearchProps } from './Search.types';


const Search = (props: SearchProps) => {
  const {
    anchorEl,
    id,
    HEIGHT,
    theme,
    searchValue,
    open,
    value,
    setSearchValue,
    handleClickFilter,
    setLocalValue,
    handleClose,
  } = useSearch(props);

  const { hideFilter = false, ...restProps } = props;

  return (
    <RowWrapper
      sx={{
        alignItems: 'center',
        gap: 2,
        justifyContent: 'space-between',
        ...restProps.sx,
      }}
    >
      {restProps.dropdownList ? (
        <Input
          placeholder={restProps.dropdownPlaceholder || 'Search By'}
          value={searchValue.field}
          type="dropdown"
          containerSx={{
            width: '30%',
          }}
          inputSx={{
            '.MuiOutlinedInput-root': {
              height: HEIGHT,
            },
            fieldset: {
              border: '1px solid',
              borderColor: theme.palette.primary.main,
            },
            justifyContent: 'center',
          }}
          onChange={(e) => {
            setSearchValue((prevState) => ({
              ...prevState,
              field: e,
            }));
          }}
          dropdownList={restProps.dropdownList}
        />
      ) : null}

      <RowWrapper
        sx={{
          alignItems: 'center',
          border: '1px solid',
          borderColor: theme.palette.primary.main,
          borderRadius: theme.radius(1),
          display: 'flex',
          flex: 1,
          height: HEIGHT,
          my: 2,
        }}
      >
        <RowWrapper
          sx={{
            alignItems: 'center',
            flex: 1,
            pr: hideFilter ? 2 : undefined,
            px: 2,
            py: 1.5,
          }}
        >
          <Icon iconName="search" textVariant="body3" sx={{ mr: 2 }} />
          <InputBase
            sx={{
              '.MuiInputBase-input': {
                height: theme.typography.body4.fontSize,
                padding: '0px',
                ...theme.typography.body4,
                fontWeight: 500,
              },
              flex: 1,
            }}
            value={searchValue.query}
            placeholder={restProps.placeholder}
            onChange={(e) => {
              setSearchValue((prevState) => ({
                ...prevState,
                query: e.target.value,
              }));
            }}
            endAdornment={
              !!searchValue.query ?
                <InputAdornment position="end">
                  <IconButton
                    sx={{
                      minWidth: 0,
                      p: 0.5,
                    }}
                    onClick={() => setSearchValue((prev) => ({ ...prev, query: '' }))}
                    sxIcon={{ path: { stroke: theme.palette.common.black } }}
                    iconName="clear"
                  />
                </InputAdornment>
                : null
            }
          />

          {!hideFilter && (
            <IconButton
              iconName="filter"
              onClick={handleClickFilter}
            />
          )}
        </RowWrapper>

        {!hideFilter && (
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
            transformOrigin={{
              horizontal: 'right',
              vertical: 'top',
            }}
          >
            <PopupFilter
              data={value}
              listContent={restProps.contentList}
              onChange={setLocalValue}
              onClose={handleClose}
            />
          </Popover>
        )}
      </RowWrapper>
    </RowWrapper>
  );
};

export default Search;
