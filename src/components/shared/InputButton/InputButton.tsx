import React from 'react';

import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';

import Icon from '@/components/shared/Icon';
import Text from '@/components/shared/Input/components/Text';

import Button from '../Button';

import type { InputButtonProps } from './InputButton.types';


const InputButton = ({
  label = '',
  placeholder = 'Search...',
  sx,
  labelSx,
  childPosition = 'end',
  icon,
  onClick,
}: InputButtonProps) => {
  return (
    <FormControl sx={{ ...(sx) }} variant="outlined">
      <Text
        sx={{ ...(labelSx) }}
      >{label}
      </Text>
      <OutlinedInput
        id={label.replace(' ', '-')}
        type="text"
        disabled
        sx={{ borderRadius: 2 }}
        placeholder={placeholder}
        endAdornment={
          <InputAdornment position={childPosition}>
            <Button onClick={onClick}>
              Search
            </Button>
          </InputAdornment>
        }
        startAdornment={
          icon ?
            <InputAdornment position="start">
              <Icon iconName="search" />
            </InputAdornment>
            :
            null
        }
        label=""
      />
    </FormControl>
  );
};

export default InputButton;
