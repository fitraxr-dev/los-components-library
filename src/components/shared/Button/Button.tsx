'use client';
import { CircularProgress, useTheme } from '@mui/material';
import ButtonMUI from '@mui/material/Button';

import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { ButtonProps } from './types';
import type { ButtonProps as MuiButtonProps } from '@mui/material';


const Button = ({
  children = '',
  color = 'primary',
  disabled = false,
  endIcon = '',
  endIconSx = {},
  isFull = false,
  isLoading = false,
  noClick = false,
  onClick = () => {},
  startIcon = '',
  startIconSx = {},
  sx = {},
  textSx = {},
  textVariant = 'button',
  textWeight = 600,
  variant = 'contained',
  ...rest
}: ButtonProps) => {
  const theme = useTheme();

  const dynamicSx: MuiButtonProps['sx'] = {
    borderRadius: theme.radius(1),
    height: 'fit-content',
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(2),
    ...(noClick && { pointerEvents: 'none' }),
    ...sx,
  };

  const textColor = disabled
    ? theme.palette.disabled.main
    : variant === 'contained'
      ? theme.palette[color].contrastText
      : theme.palette[color].main;

  const renderIcon = (iconName, sx) => (
    <Icon
      iconName={iconName}
      textVariant={textVariant}
      sx={{ path: { stroke: textColor }, ...sx }}
    />
  );

  return (
    <ButtonMUI
      onClick={onClick}
      variant={variant}
      fullWidth={isFull}
      color={color}
      disabled={disabled}
      disableElevation
      sx={dynamicSx}
      {...rest}
    >
      {startIcon &&
        !isLoading &&
        renderIcon(startIcon, { marginRight: 1, ...startIconSx })}
      <TextStyle
        variant={textVariant}
        {...(textWeight && { weight: textWeight })}
        color={textColor}
        sx={{ ...textSx }}
      >
        {isLoading ? (
          <RowWrapper sx={{ height: theme.typography.button.fontSize }}>
            <CircularProgress
              size={theme.typography.button.fontSize}
              color={variant === 'contained' ? 'white' : color}
            />
          </RowWrapper>
        ) : (
          children
        )}
      </TextStyle>
      {endIcon &&
        !isLoading &&
        renderIcon(endIcon, { marginLeft: 1, ...endIconSx })}
    </ButtonMUI>
  );
};

export default Button;
