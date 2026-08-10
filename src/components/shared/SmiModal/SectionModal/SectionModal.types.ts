import type { ModalProps } from '@mui/material';


export type SectionModalProps = {
  title?: string;
  children: React.ReactNode;
  customHeader?: React.ReactElement | any;
  containerSx?: ModalProps['sx'];
  isOpen?: boolean;
  onClose?: () => void;
  customFooter?: React.ReactNode | any;
  withConfirm?: boolean;
  onConfirm?: () => void;
  closeBtnText?: string;
}
