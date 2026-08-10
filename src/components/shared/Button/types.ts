import type { TextStyleProps } from '../TextStyle/types';
import type { TextVariant } from '@/types/TextVariant';
import type { TextWeight } from '@/types/TextWeight';
import type { ButtonProps as MuiButtonProps, SvgIconProps } from '@mui/material';


export type ButtonProps = {
  children?: React.ReactNode;
  color?: MuiButtonProps['color'];
  disabled?: boolean;
  endIcon?: string;
  endIconSx?: SvgIconProps['sx'];
  id?: string;
  isFull?: boolean;
  isLoading?: boolean;
  noClick?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  startIcon?: string;
  startIconSx?: SvgIconProps['sx'];
  sx?: MuiButtonProps['sx'];
  textSx?: TextStyleProps['sx'];
  textVariant?: TextVariant;
  textWeight?: TextWeight;
  size?: MuiButtonProps['size'];
  variant?: 'contained' | 'outlined' | 'text' ;
}
