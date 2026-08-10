import type { BoxProps } from '@mui/material';


export type TableFooterProps = {
  sx?: BoxProps['sx'];
  onClick: () => void;
  title?: string;
  disabled?: boolean;
}
