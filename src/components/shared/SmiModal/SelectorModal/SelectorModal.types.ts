export interface SelectorOption {
  key: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectorModalProps {
  title?: string;
  data?: SelectorOption[];
  onSubmit?: (items: any[]) => void;

  selected: [];
  setSelected: () => void;
  nextStep?: (items: any[]) => void;
  submitText?: string;
  isLoading?: boolean;
}
