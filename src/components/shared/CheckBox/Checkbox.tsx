import { Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';

import TextStyle from '../TextStyle';

import type { CheckboxProps } from '../CheckBox/types';


const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  ...rest
}: CheckboxProps) => {
  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          {...rest}
        />
      }
      label={<TextStyle>{label}</TextStyle>}
    />
  );
};

export default Checkbox;
