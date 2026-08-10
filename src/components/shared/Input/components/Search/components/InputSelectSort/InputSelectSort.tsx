'use client';
import React, { useCallback, useEffect } from 'react';

import { Grid, useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import type { InputSelectSortProps } from './InputSelectSort.types';


const InputSelectSort = ({ label, data, onChange, value, disabled }: InputSelectSortProps) => {
  const theme = useTheme();

  const inputSx = {
    '.MuiInputBase-input': {
      height: `calc(${theme.typography.body4.fontSize} * ${theme.typography.body4.lineHeight})`,
      padding: theme.spacing(2),
      ...theme.typography.body4,
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderRadius: theme.radius(0.5),
    },
  };

  const renderLabel = useCallback(
    () =>
      label && (
        <TextStyle
          variant="body4"
          weight={500}
          mb={1}
          color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}
        >
          {label}
        </TextStyle>
      ),
    [label],
  );

  const handleColumnName = (columnName) => {
    onChange({
      columnName,
      sortType: columnName ? value?.sortType || 'ASC' : null,
    });
  };

  const handleSortType = (sortType) => {
    onChange({
      columnName: value?.columnName,
      sortType,
    });
  };

  const activeColor = (sortType: 'ASC' | 'DESC') => {
    if (sortType === value?.sortType) return theme.palette.primary.main;
    return theme.palette.action.disabled;
  };

  useEffect(() => {
    if (disabled) {
      onChange({
        columnName: null,
        sortType: null,
      });
    }
  }, [disabled]);

  return (
    <ColumnWrapper>
      {renderLabel()}
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Input
            disabled={disabled}
            inputSx={inputSx}
            dropdownList={[
              ...data,
            ]}
            type="dropdown"
            onChange={handleColumnName}
            value={value?.columnName || null}
            placeholder="Select One"
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            disabled={disabled}
            startIcon="ascending"
            onClick={() => handleSortType('ASC')}
            textVariant="body1"
            sx={{
              '&:hover': {
                backgroundColor: activeColor('ASC'),
              },
              backgroundColor: activeColor('ASC'),
              height: '100%',
              marginRight: 0.5,
              minWidth: 0,
              padding: 0,
              width: theme.spacing(7),
            }}
            startIconSx={{
              marginRight: 0,
            }}
          />
          <Button
            disabled={disabled}
            startIcon="descending"
            onClick={() => handleSortType('DESC')}
            textVariant="body1"
            sx={{
              '&:hover': {
                backgroundColor: activeColor('DESC'),
              },
              alignSelf: 'end',
              backgroundColor: activeColor('DESC'),
              height: '100%',
              minWidth: 0,
              padding: 0,
              width: theme.spacing(7),
            }}
            startIconSx={{
              marginRight: 0,
            }}
          />
        </Grid>
      </Grid>
    </ColumnWrapper>
  );
};

export default InputSelectSort;
