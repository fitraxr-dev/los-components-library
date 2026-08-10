import type { ButtonProps } from '@/components/shared/Button/types';
import type { ButtonProps as MuiButtonProps } from '@mui/material';


export type DraftMemoHistoryProps = {
  process: string;
  module: string;
  buttons?: Array<DraftMemoButtonProps>;
  title?: string; // Untuk akomodir perbedaan titel pada History Memo Notifikasi Pembiayaan
  id?: string; // untuk kebutuan parsing parentId
}

export type DraftMemoButtonProps = {
  label: string;
  iconName?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonProps['variant'];
  color?: MuiButtonProps['color'];
}
