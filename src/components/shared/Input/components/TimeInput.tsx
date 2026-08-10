import { useTheme } from '@mui/material';
import MuiSvgIcon from '@mui/material/SvgIcon';
import { renderDigitalClockTimeView, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';


import useInput from '../Input.hook';

import type { InputProps } from '../Input.types';
import type { DesktopTimePickerSlotsComponentsProps } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';


const TimeInput = (props: InputProps) => {
  const {
    onChange,
    inputRef,
    value,
    disabled,
    ref,
    error,
    helperText,
    InputProps,
    timeSteps,
    maxTime,
    minTime,
  } = props;
  const theme = useTheme();
  const { style } = useInput();

  const parseTime = (time?: string | number | Date | Dayjs) => {
    if (!time) return undefined;
    if (dayjs.isDayjs(time)) return time;

    const parsed = dayjs(time.toLocaleString(), 'HH:mm');

    return parsed.isValid() ? parsed : undefined;
  };

  const formattedValue = parseTime(String(value));
  const formattedMaxTime = parseTime(maxTime);
  const formattedMinTime = parseTime(minTime);

  const disabledInputProps = disabled ? {
    className: 'Mui-disabled',
    readOnly: true,
  } : {};

  const slotProps: DesktopTimePickerSlotsComponentsProps<any> = {
    leftArrowIcon: {
      iconName: 'arrow-left',
      textVariant: 'body4',
    },
    openPickerIcon: {
      iconName: 'timeline',
      textVariant: 'body4',
      ...(disabled && {
        sx: {
          height: '10px',
          path: {
            stroke: theme.palette.custom.gray30,
          },
          width: '10px',
        },
      }),
    },
    rightArrowIcon: {
      iconName: 'arrow-right',
      textVariant: 'body4',
    },
    textField: {
      InputProps: { ...InputProps, ...disabledInputProps },
      error: error,
      helperText: helperText,
      sx: style,
    },
  };


  const MuiIcon = () => {
    return <MuiSvgIcon
      sx={{
        fill: 'none',
        fontSize: theme.typography.body2.fontSize,
      }}
      inheritViewBox
      component={null}
    />;
  };

  return (
    <TimePicker
      ref={ref}
      inputRef={inputRef}
      onChange={(val) => {
        const day = dayjs(val).format('HH:mm');
        onChange(day);
      }}
      viewRenderers={{
        hours: renderDigitalClockTimeView,
        minutes: renderDigitalClockTimeView,
        seconds: renderDigitalClockTimeView,
      }}
      timeSteps={timeSteps}
      slotProps={slotProps}
      slots={{ openPickerIcon: MuiIcon }}
      sx={style}
      ampm={false}
      disabled={disabled}
      readOnly={disabled}
      timezone="Asia/Jakarta"
      value={formattedValue}
      minutesStep={30}
      skipDisabled
      maxTime={formattedMaxTime}
      minTime={formattedMinTime}
    />
  );
};

export default TimeInput;
