'use client';
import React from 'react';

import { styled, useTheme } from '@mui/material';
import MuiSwitch from '@mui/material/Switch';


import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { SwitchProps } from './types';


const Switch = ({
  label = '',
  checked = false,
  onChange = () => {},
  sx = {},
  disabled = false,
  ...rest
}: SwitchProps) => {
  const theme = useTheme();

  return (
    <RowWrapper sx={{ alignItems: 'center', ...sx }} {...rest}>
      <IOSSwitch checked={checked} onChange={onChange} disabled={disabled} />
      {label && (
        <TextStyle variant="body4" sx={{ marginLeft: theme.spacing(2) }}>
          {label}
        </TextStyle>
      )}
    </RowWrapper>
  );
};

const IOSSwitch = styled((props) => (
  <MuiSwitch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
))<{checked: boolean; onChange: () => void; disabled: boolean}>(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        border: 0,
        opacity: 1,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
      color: '#fff',
      transform: 'translateX(0.7vw)',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      border: '0.3vw solid #fff',
      color: '#33cf4d',
    },
    margin: theme.spacing(0.2),
    padding: 0,
    transitionDuration: '300ms',
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    height: '1.075vw',
    width: '1.075vw',
  },
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.custom.gray30,
    borderRadius: '0.68vw',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
  height: '1.25vw',
  padding: 0,
  width: '2vw',
}));

export default Switch;
