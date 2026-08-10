import type { BoxProps } from '@mui/material';


export type SectionTitleOLProps = {
  title?: string;
  subtitle?: string;
  isMandatory?: boolean;
  sx?: BoxProps['sx'];
  children?: React.ReactNode;
  isOpen?: boolean;
  rightComponent?: React.ReactNode;
}
