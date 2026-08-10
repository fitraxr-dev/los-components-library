import type { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';


export interface CheckboxSelectAllProps extends Omit<MuiCheckboxProps, 'onChange'> {
  onChange: () => void;
  tooltipTitle?: string;
}
