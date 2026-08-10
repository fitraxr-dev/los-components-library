import type { MergeTypes } from '@/types/MergeType';
import type { BoxProps } from '@mui/material';


export type RowWrapperProps = MergeTypes<
BoxProps,
{
  children?: React.ReactNode;
  sx?: BoxProps['sx'];
}
>
