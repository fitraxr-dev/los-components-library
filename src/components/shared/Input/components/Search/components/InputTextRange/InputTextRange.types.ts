export type InputTextRangeProps = {
  label?: string;
  startValue?: number;
  endValue?: number;
  onChange?: (val: {
    start: number;
    end: number;
  }) => void;
  disabled?: boolean;
  placeholder1?: string;
  placeholder2?: string;
}
