import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';


export type InputAutocompleteV2Props = {
  label?: string;
  data?: string;
  onChange?: (val: AutocompleteOption) => void;
  onInputChange?: (val: string) => void;
  value?: AutocompleteOption;
  disabled?: boolean;
  isLoading?: boolean;
  dropdownList?: Array<AutocompleteOption>;
}
