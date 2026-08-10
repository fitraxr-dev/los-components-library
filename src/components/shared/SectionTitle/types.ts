import type { ButtonProps } from '../Button/types';
import type { BoxProps } from '@mui/material';


export type SectionTitleButtons = {
  label: string;
  iconName?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  color?: ButtonProps['color'];
}

export type SectionTitleProps = {
  title?: string | JSX.Element;
  subtitle?: string;
  isMandatory?: boolean;
  sx?: BoxProps['sx'];
  tooltipText?: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  hideToggle?: boolean;
  buttons?: Array<SectionTitleButtons>;
  rightComponent?: React.ReactNode;
}
