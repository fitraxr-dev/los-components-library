import type { BoxProps } from '@mui/material';


export type Tabs = string | number

export type TabsProps = {
  dataChangesList?: string[];
  activeTab?: Tabs;
  onChange?: (val: Tabs) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  items?: Array<{
    label: string;
    value?: string;
    disabled?: boolean;
    isButtonShow?: boolean;
    tooltip?: string;
  }>;
}

export type TabItemProps = {
  activeValue?: Tabs;
  children?: React.ReactNode;
  value?: Tabs;
  sx?: BoxProps['sx'];
}
