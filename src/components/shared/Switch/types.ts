import type { BoxProps } from '@mui/material';


export type SwitchProps = {
  label?: string;
  checked?: boolean;
  onChange?: () => void;
  sx?: BoxProps['sx'];
  disabled?: boolean;
}
