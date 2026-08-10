'use client';
import { useEffect, useRef } from 'react';

import { useTheme } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import Icon from '@/components/shared/Icon';

import useInput from '../Input.hook';

import type { InputProps } from '../Input.types';
import type { DesktopDatePickerSlotsComponentsProps } from '@mui/x-date-pickers';


const Year = ({ ...props }: InputProps) => {
  const theme = useTheme();
  const { style } = useInput();
  const inputElementRef = useRef<HTMLInputElement | null>(null);

  const {
    disabled,
    onChange,
    value,
    inputRef,
    error,
    helperText,
    InputProps,
    popper = { placement: 'bottom' },
    inputSx,
    hasDataMaster,
    placeholder,
  } = props;

  const styleDataMaster = {
    backgroundColor: hasDataMaster && '#FCE6E8',
  };

  // 📅 Hanya tahun
  const format = 'YYYY';
  const typographySize = theme.typography.body4.fontSize;
  const spacingUnit = theme.spacing(1);

  const slotProps: DesktopDatePickerSlotsComponentsProps<any> = {
    layout: {
      sx: {
        '.MuiPickersYear-yearButton': {
          fontSize: typographySize,
          height: `calc(${typographySize} + ${theme.spacing(2)})`,
          margin: spacingUnit,
          padding: spacingUnit,
          width: `calc(${typographySize} + ${theme.spacing(6)})`,
        },
      },
    },
    leftArrowIcon: { iconName: 'arrow-left', textVariant: 'body4' },
    openPickerIcon: {
      iconName: 'calendar',
      sx: disabled ? { path: { stroke: theme.palette.custom.gray30 } } : {},
      textVariant: 'body4',
    },
    popper,
    rightArrowIcon: { iconName: 'arrow-right', textVariant: 'body4' },
    switchViewIcon: { iconName: 'calendar', textVariant: 'body4' },
    textField: {
      InputProps: { ...InputProps, ...(disabled && { readOnly: true }) },
      error,
      helperText,
      placeholder: placeholder || '',
      sx: {
        ...style,
        ...styleDataMaster,
        ...inputSx,
        '& .MuiInputBase-input': {
          ...style['.MuiInputBase-input'],
          '&:-ms-input-placeholder': {
            color: `${theme.palette.text.disabled} !important`,
            opacity: '1 !important',
          },
          '&::-moz-placeholder': {
            color: `${theme.palette.text.disabled} !important`,
            opacity: '1 !important',
          },
          '&::-webkit-input-placeholder': {
            color: `${theme.palette.text.disabled} !important`,
            opacity: '1 !important',
          },
          '&::placeholder': {
            color: `${theme.palette.text.disabled} !important`,
            opacity: '1 !important',
          },
        },
      },
    },
  };

  // 🔁 Format output hanya tahun
  const handleChange = (val: any) => {
    const formatted = val ? dayjs(val).format('YYYY') : '';
    onChange?.(formatted);
  };

  // Apply placeholder styling when input is empty or shows format pattern
  useEffect(() => {
    const findInputElement = (): HTMLInputElement | null => {
      const refElement = inputElementRef.current || (inputRef && typeof inputRef === 'object' ? inputRef.current : null);
      if (refElement instanceof HTMLInputElement) {
        return refElement;
      }
      return refElement?.querySelector?.('input') as HTMLInputElement | null || null;
    };

    const updatePlaceholderStyle = () => {
      const htmlInput = findInputElement();
      if (htmlInput) {
        const inputValue = htmlInput.value || '';
        const isEmpty = !value || !inputValue || inputValue === format || inputValue === 'YYYY';
        htmlInput.style.color = isEmpty ? theme.palette.text.disabled : theme.palette.text.primary;
      }
    };

    const timeoutId = setTimeout(updatePlaceholderStyle, 50);
    return () => clearTimeout(timeoutId);
  }, [value, format, inputRef, theme.palette.text.disabled, theme.palette.text.primary]);

  const combinedInputRef = (node: HTMLInputElement | null) => {
    inputElementRef.current = node;
    if (typeof inputRef === 'function') {
      inputRef(node);
    } else if (inputRef) {
      inputRef.current = node;
    }
  };

  return (
    <DesktopDatePicker
      views={['year']}
      openTo="year"
      format={format}
      readOnly={disabled}
      inputRef={combinedInputRef}
      onChange={handleChange}
      value={typeof value === 'string' ? dayjs(value, 'YYYY') : null}
      slots={{
        leftArrowIcon: Icon,
        openPickerIcon: Icon,
        rightArrowIcon: Icon,
        switchViewIcon: Icon,
      }}
      slotProps={slotProps}
    />
  );
};

export default Year;
