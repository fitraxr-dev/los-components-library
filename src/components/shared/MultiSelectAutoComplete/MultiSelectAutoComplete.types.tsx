import type { BoxProps } from '@mui/material';


export type MultiSelectAutoCompleteProps = {
  label?: string;
  data?: string;
  onChange?: (val: MultiSelectAutoCompleteOption[]) => void;
  onInputChange?: (val: string) => void;
  value?: MultiSelectAutoCompleteOption[];
  disabled?: boolean;
  isLoading?: boolean;
  dropdownList?: MultiSelectAutoCompleteOption[];
  id?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  isMandatory?: boolean;
  withSelectAll?: boolean;
  sx?: BoxProps['sx'];

}


export type MultiSelectAutoCompleteOption = {
  label: string;
  id: string | number;
  value?: string | number;
}
