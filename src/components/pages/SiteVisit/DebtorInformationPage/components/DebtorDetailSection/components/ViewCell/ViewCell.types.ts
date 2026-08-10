import type { GridProps } from '@mui/material';


export type ViewCellProps = {
  title?: string;
  value?: string;
  url?: string;
  buttons?: Array<{
    iconName: string;
    label: string;
    action: () => void;
  }>;
  bottomBorder?: string;
  bottomBorderColor?: `#${string}`;
  titleColor?: `#${string}`;
  sx?: GridProps['sx'];
  sxValue?: GridProps['sx'];
  sxLabel?: GridProps['sx'];
}
