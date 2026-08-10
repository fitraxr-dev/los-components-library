import type { MergeTypes } from '@/types/MergeType';
import type { BoxProps } from '@mui/material';


export type ColumnWrapperProps = MergeTypes<
BoxProps,
{
  children?: React.ReactNode;
  sx?: BoxProps['sx'];
}
>
