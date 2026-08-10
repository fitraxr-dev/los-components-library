type TBaseCurrencyProps = {
  value: number | string; // Currency values are typically numbers
  error?: boolean;
  errorMessage?: string;
  onChange?: (val: any) => void;
  disabled?: boolean;
};

type TCurrencyInitial = TBaseCurrencyProps & {
  label: string;
  placeholder: string;
  currency: string;
  isMandatory?: boolean;
  onCurrencyChange: (val: any) => void;
};

type TCurrencyKurs = TBaseCurrencyProps & {
  isMandatory?: boolean;
};

type TCurrencyIdr = TBaseCurrencyProps;

export type TCurrencyProps = {
  initialProps?: TCurrencyInitial;
  kursProps?: TCurrencyKurs;
  idrProps?: TCurrencyIdr;
};
