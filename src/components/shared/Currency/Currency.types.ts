import type { Dropdown } from '../Input/Input.types';
import type { BoxProps, TextFieldProps } from '@mui/material';


export type CurrencyProps = {
  id?: string;
  testId?: string;
  inputRef?: any;
  label?: string;
  suffix?: string;
  labelProps?: any;
  containerSx?: BoxProps['sx'];
  disabled?: boolean;
  disabledCurrency?: boolean;
  onChange?: (val: any) => void;
  placeholder?: string;
  value?: {
    currency: string;
    value: string | number;
  };
  maxLength?: number;
  error?: boolean;
  helperText?: string;
  currencyList?: Dropdown[];
  inputSx?: TextFieldProps['sx'];
  isMandatory?: boolean;
  onCurrencyChange?: (val?: any) => void;
  hasDataMaster?: string;
  currHasDataMaster?: string;
  maxAmount?: number | string;
}
