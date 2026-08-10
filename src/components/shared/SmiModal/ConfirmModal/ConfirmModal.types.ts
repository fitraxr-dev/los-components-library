export type ConfirmModalProps = {
  customProp?: {
    icon?: string;
    text?: string;
    color?: string;
    size?: string;
  };
  title?: string | React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  cancelText?: string;
  agreeText?: string;
}
