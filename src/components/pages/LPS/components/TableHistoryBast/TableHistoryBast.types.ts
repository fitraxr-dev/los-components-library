import type { ButtonProps as MuiButtonProps } from '@mui/material';


export type TableHistoryBastProps = {
  process: string;
  module: string;
  buttons?: Array<HistoryButtonProps>;
  id?: string; // untuk kebutuan parsing parentId
  hideBtnAdd?: boolean;
}

export type HistoryButtonProps = {
  label: string;
  iconName?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: string;
  color?: MuiButtonProps['color'];
}
