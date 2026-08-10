import type { TextVariant } from '@/types/TextVariant';
import type { ReactNode } from 'react';


export type ErrorModalProps = {
  customProp?: { header?: string; sx?: Object; variant?: TextVariant };
  title?: string | ReactNode;
  onClose?: () => void;
}
