import type { BoxProps, ButtonProps } from '@mui/material';


export type TitleButtons = {
  label: string;
  iconName?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  color?: ButtonProps['color'];
}

export type TitleProps = {
  title?: string;
  buttons?: Array<TitleButtons>;
  sx?: BoxProps['sx'];
  customRender?: React.ReactNode;
}
