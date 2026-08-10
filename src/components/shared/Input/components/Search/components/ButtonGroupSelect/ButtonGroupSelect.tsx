'use client';
import React, { useCallback, useEffect } from 'react';

import { useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { ButtonGroupSelectProps } from './ButtonGroupSelect.types';


const ButtonGroupSelect = ({
  buttonSx = {},
  data,
  label = '',
  multiple = false,
  onChange = () => {},
  sx = {},
  value = [],
  disabled = false,
}: ButtonGroupSelectProps) => {
  const theme = useTheme();

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

  const inactiveSx = {
    backgroundColor: 'transparent',
    borderColor: theme.palette.action.disabled,
  };

  const handleSelect = (selectedValue: string) => {
    const isExist = value.find((el) => el === selectedValue);

    if (multiple) {
      if (isExist) onChange(value.filter((el) => isExist !== el));
      else onChange([...value, selectedValue]);
    } else if (isExist) onChange([]);
    else onChange(selectedValue);
  };

  useEffect(() => {
    if (disabled) {
      onChange([]);
    }
  }, [disabled]);

  return (
    <ColumnWrapper sx={{ ...sx }}>
      {renderLabel()}
      <RowWrapper sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {data?.map((el) => (
          <Button
            disabled={disabled}
            key={el.value}
            onClick={() => handleSelect(el.value)}
            variant="outlined"
            textVariant="body4"
            sx={{
              borderRadius: theme.spacing(1),
              paddingBottom: theme.spacing(0.5),
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
              paddingTop: theme.spacing(0.5),
              ...buttonSx,
              ...(!value?.includes(el.value) && inactiveSx),
            }}
            textSx={{
              color: value?.includes(el.value)
                ? theme.palette.primary.main
                : theme.palette.action.disabled,
            }}
          >
            {el.label}
          </Button>
        ))}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ButtonGroupSelect;
