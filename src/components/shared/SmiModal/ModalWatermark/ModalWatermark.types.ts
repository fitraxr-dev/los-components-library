import type { ButtonProps } from '@/components/shared/Button/types';


export type ModalWatermarkProps = {
  initialWatermark?: string;
  viewOnly?: boolean;
  onSave: (value: ModalWatermarkOnSaveProp) => void;
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

type ModalWatermarkOnSaveProp = {
  watermark: string;
  radioValue?: string;
}
