import type { TextFieldProps } from '@mui/material';


export type InputMultipleAutocompleteProps = {
  label?: string;
  data?: string;
  onChange?: (val: string[]) => void;
  onInputChange?: (val: string) => void;
  onOpen?: () => void;
  value?: string[];
  disabled?: boolean;
  isLoading?: boolean;
  dropdownList?: MultipleAutocompleteOption[];
  id?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  isMandatory?: boolean;
  withSelectAll?: boolean;
  onDeleteAll?: () => void;
  onDeleteItem?: (option: MultipleAutocompleteOption, cb: (event) => void, index: number) => void;
  limitTags?: number;
  sortingType?: 'increase' | 'decrease' | 'last-in';
  hasDataMaster?: string;
  inputSx?: TextFieldProps['sx'];

}


export type MultipleAutocompleteOption = {
  label: string;
  value: string | number;
}
