type TBaseCurrencyProps = {
  value: number | string; // Currency values are typically numbers
  error?: boolean;
  errorMessage?: string;
  onChange?: (val: any) => void;
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
  disabled?: boolean;
  initialProps?: TCurrencyInitial;
  kursProps?: TCurrencyKurs;
  idrProps?: TCurrencyIdr;
};
