'use client';
import { useTheme } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import Icon from '@/components/shared/Icon';

import useInput from '../Input.hook';

import type { InputProps } from '../Input.types';
import type { DesktopDatePickerSlotsComponentsProps } from '@mui/x-date-pickers';


const Month = ({ ...props }: InputProps) => {
  const theme = useTheme();
  const { style } = useInput();

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
  } = props;

  const styleDataMaster = {
    backgroundColor: hasDataMaster && '#FCE6E8',
  };

  const format = 'MM/YYYY';

  const typographySize = theme.typography.body4.fontSize;
  const spacingUnit = theme.spacing(1);
  const computedSize = `calc(${typographySize} + ${spacingUnit})`;

  const slotProps: DesktopDatePickerSlotsComponentsProps<any> = {
    layout: {
      sx: {
        '.MuiPickersCalendarHeader-labelContainer': { fontSize: typographySize },
        '.MuiPickersMonth-monthButton': {
          fontSize: typographySize,
          height: `calc(${typographySize} + ${theme.spacing(2)})`,
          margin: spacingUnit,
          padding: spacingUnit,
          width: `calc(${typographySize} + ${theme.spacing(6)})`,
        },
        '.MuiYearCalendar-root': {
          paddingBottom: theme.spacing(3),
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
      placeholder: 'MM/YYYY',
      sx: { ...style, ...styleDataMaster, ...inputSx },
    },
  };

  const handleChange = (val: any) => {
    const formatted = val ? dayjs(val).format('MM-YYYY') : '';
    onChange?.(formatted);
  };

  return (
    <DesktopDatePicker
      views={['year', 'month']}
      openTo="month"
      format={format}
      readOnly={disabled}
      inputRef={inputRef}
      onChange={handleChange}
      value={typeof value === 'string' ? dayjs(value, 'MM-YYYY') : null}
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

export default Month;
