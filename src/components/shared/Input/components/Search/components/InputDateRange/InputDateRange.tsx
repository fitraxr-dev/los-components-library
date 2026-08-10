'use client';
import React, { useCallback, useEffect } from 'react';

import { useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { InputDateRangeProps } from './InputDateRange.types';


const InputDateRange = ({
  label = '',
  startDateValue = '',
  endDateValue = '',
  onChange = () => { },
  disabled = false,
  placeholder1 = '',
  placeholder2 = '',
  allowFutureDates = false,
  disablePastDates = false,
}: InputDateRangeProps) => {
  const theme = useTheme();

  const inputSx = {
    '.MuiIconButton-edgeEnd': {
      padding: theme.spacing(1),
    },
    '.MuiInputAdornment-positionEnd': {
      marginLeft: 0,
    },
    '.MuiInputBase-input': {
      height: `calc(${theme.typography.body4.fontSize} * ${theme.typography.body4.lineHeight})`,
      padding: theme.spacing(2),
      ...theme.typography.body4,
      fontWeight: 500,
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderRadius: theme.radius(1),
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

  const handleChangeDate = (type, value) => {
    onChange({
      endDate: type === 'endDate' ? value : endDateValue,
      startDate: type === 'startDate' ? value : startDateValue,
    });
  };

  useEffect(() => {
    if (disabled) {
      onChange({
        endDate: null,
        startDate: null,
      });
    }
  }, [disabled]);

  return (
    <ColumnWrapper>
      {renderLabel()}
      <RowWrapper sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
        <Input
          type="date"
          disabled={disabled}
          maxDate={allowFutureDates ? undefined : (endDateValue || (new Date()).toISOString())}
          value={startDateValue || null}
          onChange={(val: string) => handleChangeDate('startDate', val)}
          inputSx={inputSx}
          minDate={disablePastDates ? (new Date()).toISOString() : undefined}
          placeholder={placeholder1}
        />
        <Icon iconName="arrow-right" textVariant="body4" />
        <Input
          type="date"
          disabled={disabled}
          maxDate={allowFutureDates ? undefined : (new Date()).toISOString()}
          minDate={startDateValue ? startDateValue : disablePastDates ? (new Date()).toISOString() : undefined}
          value={endDateValue || null}
          onChange={(val) => handleChangeDate('endDate', val)}
          inputSx={inputSx}
          placeholder={placeholder2}
        />
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default InputDateRange;
