import type { SxProps, Theme } from '@mui/material';


export type CustomCheckboxProps = {
  indeterminate?: boolean;
  checked: boolean;
  id: string;
  compute: (checkboxId: string, status: number) => void;
  type?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  viewOnly?: boolean;
}
