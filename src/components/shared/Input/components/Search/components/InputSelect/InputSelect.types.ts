export type InputSelectProps = {
  label?: string;
  data?: Array<{
    value: string;
    label: string;
  }>;
  onChange?: (val: string) => void;
  value?: string;
  disabled?: boolean;
}
