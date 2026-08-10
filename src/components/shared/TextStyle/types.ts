import type { MergeTypes } from '@/types/MergeType';
import type { TextVariant } from '@/types/TextVariant';
import type { TextWeight } from '@/types/TextWeight';
import type { BoxProps, TypographyProps } from '@mui/material';


export type TextStyleProps = MergeTypes<
TypographyProps,
{
  color?: string;
  sx?: BoxProps['sx'];
  variant?: TextVariant;
  weight?: TextWeight;
}
>
