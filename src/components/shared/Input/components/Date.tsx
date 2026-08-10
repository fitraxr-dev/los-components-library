'use client';
import { useTheme } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import Icon from '@/components/shared/Icon';

import useInput from '../Input.hook';

import type { InputProps } from '../Input.types';
import type { DesktopDatePickerSlotsComponentsProps } from '@mui/x-date-pickers';


const Date = ({ ...props }: InputProps) => {
  const theme = useTheme();
  const { style } = useInput();

  const {
    disabled,
    onChange,
    format = 'DD/MM/YYYY',
    value,
    inputRef,
    error,
    helperText,
    maxDate,
    minDate,
    InputProps,
    popper = { placement: 'bottom' },
    openTo,
    view,
    views = ['year', 'month', 'day'],
    widthMonthWrapper = '4',
    widthYearWrapper = '4',
    inputSx,
    hasDataMaster,
    disableFutureDates = false,
  } = props;

  const styleDataMaster = {
    backgroundColor: hasDataMaster && '#FAD5D9',
  };


  // 📌 Check if Year-Only View is Selected
  const isYearOnly = views.length === 1 && views.includes('year');

  // 📌 Extracted Common Styling Variables
  const typographySize = theme.typography.body4.fontSize;
  const spacingUnit = theme.spacing(1);
  const computedSize = `calc(${typographySize} + ${spacingUnit})`;
  const disabledStyles = disabled ? { cursor: 'not-allowed', opacity: 0.6 } : {};

  // 📌 MUI Component Slot Props for Styling
  const slotProps: DesktopDatePickerSlotsComponentsProps<any> = {
    layout: {
      sx: {
        '.MuiDateCalendar-root': isYearOnly
          ? {
            height: `calc((${typographySize} + ${theme.spacing(10)}) * ${widthYearWrapper})`,
            width: `calc((${typographySize} + ${theme.spacing(10)}) * ${widthYearWrapper})`,
          }
          : {
            height: `calc((${typographySize} + ${theme.spacing(13)}) * ${widthMonthWrapper})`,
            width: `calc((${typographySize} + ${theme.spacing(13)}) * ${widthMonthWrapper})`,
          },
        '.MuiDateCalendar-viewTransitionContainer': { margin: theme.spacing(1) },
        '.MuiDayCalendar-slideTransition': {
          minHeight: `calc(${typographySize} + ${theme.spacing(3)}) * 6.5 !important`,
        },
        '.MuiDayCalendar-weekDayLabel': {
          fontSize: typographySize,
          margin: spacingUnit,
        },
        '.MuiPickersCalendarHeader-labelContainer': { fontSize: typographySize },
        '.MuiPickersCalendarHeader-root': { marginBottom: spacingUnit * 2, marginTop: spacingUnit * 2 },
        '.MuiPickersDay-root, .MuiDayCalendar-weekDayLabel': {
          fontSize: typographySize,
          height: computedSize,
          margin: spacingUnit,
          width: computedSize,
        },
        '.MuiPickersMonth-monthButton, .MuiPickersYear-yearButton': {
          fontSize: typographySize,
          height: `calc(${typographySize} + ${theme.spacing(2)})`,
          lineHeight: theme.typography.body4.lineHeight,
          margin: spacingUnit,
          padding: spacingUnit,
          width: `calc(${typographySize} + ${theme.spacing(6)})`,
        },
        '.MuiYearCalendar-root': {
          maxHeight: '17.5vw',
          paddingBottom: theme.spacing(3),
          width: `calc((${typographySize} + ${theme.spacing(10)}) * ${widthYearWrapper})`,
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
      placeholder: props.placeholder,
      sx: { ...style, ...styleDataMaster, ...inputSx, ...disabledStyles },
    },
  };

  // 📌 Event Handler for Date Change
  const handleChange = (val: any) => onChange(val);

  return (
    <DesktopDatePicker
      readOnly={disabled}
      inputRef={inputRef}
      format={format}
      onChange={handleChange}
      slots={{
        leftArrowIcon: Icon,
        openPickerIcon: Icon,
        rightArrowIcon: Icon,
        switchViewIcon: Icon,
      }}
      slotProps={slotProps}
      value={value ? dayjs(value as string) : null}
      views={views}
      minDate={minDate ? dayjs(minDate) : dayjs('1500-01-01')}
      maxDate={
        maxDate
          ? dayjs(maxDate)
          : disableFutureDates
            ? dayjs()
            : isYearOnly
              ? dayjs(value as string)
              : undefined
      }
      openTo={openTo}
      view={view}
    />
  );
};

export default Date;
