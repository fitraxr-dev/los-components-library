import type { BoxProps, TextFieldProps } from '@mui/material';


export type AutocompleteProps = {
  id?: string;
  testId?: string;
  disabled?: boolean;
  isLoading?: boolean;
  dropdownList?: Array<AutocompleteOption>;
  inputSx?: TextFieldProps['sx'];
  label?: string;
  maxLength?: number;
  onChange?: (val: AutocompleteOption) => void;
  onInputChange?: (val: string) => void;
  placeholder?: string;
  value?: AutocompleteOption;
  color?: string;
  children?: React.ReactNode;
  error?: boolean;
  helperText?: string;
  isMandatory?: boolean;
  containerSx?: BoxProps['sx'];
  hasDataMaster?: string;
}

export type AutocompleteOption = {
  id?: string | number;
  label: string;
}
