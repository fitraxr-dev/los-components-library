import type { TextVariant } from '@/types/TextVariant';
import type { SvgIconProps } from '@mui/material';


export type IconProps = {
  iconName?: string;
  textVariant?: TextVariant;
  sx?: SvgIconProps['sx'];
}
