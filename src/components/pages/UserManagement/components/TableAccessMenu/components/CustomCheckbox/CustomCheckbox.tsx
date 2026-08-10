import React from 'react';

import { Checkbox } from '@mui/material';

import useCustomCheckbox from './CustomCheckbox.hook';

import type { CustomCheckboxProps } from './CustomCheckbox.types';


const CustomCheckbox = (props: CustomCheckboxProps) => {
  const { indeterminate, checked, id, type = '', disabled = false, sx, viewOnly } = props;

  const { checkboxRef, handleOnChange } = useCustomCheckbox(props);

  return (
    <Checkbox
      inputRef={checkboxRef}
      checked={checked}
      indeterminate={indeterminate}
      disabled={viewOnly ? viewOnly : disabled}
      id={id}
      color="primary"
      onChange={(e) => type === 'parent' ? () => {} : handleOnChange(e)}
      inputProps={{ 'aria-label': 'controlled' }}
      sx={{
        ...sx,
        transition: 'ease-in',
      }}
    />
  );
};

export default CustomCheckbox;
