import type { TextStyleProps } from '../TextStyle/types';
import type { FormControlProps, InputAdornmentProps } from '@mui/material';


export type InputButtonProps = {
  label?: string;
  placeholder?: string;
  sx?: FormControlProps['sx'];
  labelSx?: TextStyleProps['sx'];
  childPosition?: InputAdornmentProps['position'];
  icon?: string;
  onClick: () => void;
}
