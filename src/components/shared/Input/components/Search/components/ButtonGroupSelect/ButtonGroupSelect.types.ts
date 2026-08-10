import type { BoxProps, ButtonProps } from '@mui/material';


export type ButtonGroupSelectProps = {
  buttonSx?: ButtonProps['sx'];
  data?: Array<{
    value: string;
    label: string;
  }>;
  label?: string;
  multiple?: boolean;
  onChange?: (value: Array<string> | string) => void;
  sx?: BoxProps['sx'];
  value?: Array<string>;
  disabled?: boolean;
}
