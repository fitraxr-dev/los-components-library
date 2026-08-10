import type { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';


export interface CheckboxProps extends Omit<MuiCheckboxProps, 'onChange'> {
  label?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
}
