import type { MipStepResponseDto } from '@/services/openapi/processor-service';
import type { BoxProps } from '@mui/material';


export type TabValue = string | number

export type MasterParameterTabItems = Array<{
  label: string;
  value: TabValue;
  disabled?: boolean;
} | MipStepResponseDto>

export interface MasterParameterTabsProps {
  items: MasterParameterTabItems;
  onValueChange?: (val?: TabValue) => void;
}

export interface MasterParameterTabPanelProps {
  children: React.ReactNode;
  value: TabValue;
  sx?: BoxProps['sx'];
}
