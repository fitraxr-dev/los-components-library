export type InputDateRangeProps = {
  label?: string;
  startDateValue?: string;
  endDateValue?: string;
  onChange?: (val: {
    startDate: string;
    endDate: string;
  }) => void;
  disabled?: boolean;
  placeholder1?: string;
  placeholder2?: string;
  allowFutureDates?: boolean;
  disablePastDates?: boolean;
}
