import type { ButtonProps } from '../../Button/types';
import type { ReactNode } from 'react';


export type ModalCommentProps = {
  initialComment?: string;
  viewOnly?: boolean;
  onSave: (value: ModalCommentOnSaveProp) => void;
  addedSection?: ReactNode;
  radioLabel?: string;
  radioOptions?: Array<{
    label: string;
    value: string;
  }>;
  submitText?: string;
  submitButtonColor?: ButtonProps['color'];
  isLoading?: boolean;
  isRadioMandatory?: boolean;
  title?: string;
  label?: string;
}

type ModalCommentOnSaveProp = {
  comment: string;
  radioValue?: string;
}
