export type WarningModalProps = {
  title?: string;
  onClose?: () => void;
  closeText?: string;
  agreeText?: string;
  parseHtml?: boolean;
  textAlign?: 'left' | 'center' | 'right';
}
