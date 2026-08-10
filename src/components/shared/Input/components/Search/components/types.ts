import type { AutocompleteOption } from '../../../../Autocomplete/types';
import type { SearchValue } from '../Search.types';


export interface IFilterContentItem {
  type: string;
  key?: string;
  startKey?: string;
  endKey?: string;
  label: string;
  options?: Array<{
    value: string;
    label: string;
  }> | Array<AutocompleteOption>;
  isDisabled?: boolean;
  watch?: (value: any) => void; // Value watcher
  isLoading?: boolean; // For Autocomplete
  onKeywordChange?: (value: string) => void; // For Autocomplete
  resetTargetAutocompleteKeys?: string[]; // For Autocomplete
  placeholder1?: string;
  placeholder2?: string;
  startDisabled?: boolean;
  endDisabled?: boolean;
}

export type PopupFilterProps = {
  data?: SearchValue;
  listContent?: Array<IFilterContentItem>;
  onChange?: (value: SearchValue) => void;
  onClose?: () => void;
}
