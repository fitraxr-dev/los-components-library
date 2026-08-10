import type { BoxProps } from '@mui/material';


type AutocompleteOption = {
  id: string | number;
  label: string;
}

export type SearchProps = {
  contentList?: Array<{
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
    watch?: (value: any) => void;
    isLoading?: boolean;
    onKeywordChange?: (value: string) => void;
    placeholder1?: string;
    placeholder2?: string;
    disablePastDates?: boolean;
    allowFutureDates?: boolean;
  }>;
  dropdownList?: Array<any>;
  dropdownPlaceholder?: string;
  hasFilter?: boolean;
  hideFilter?: boolean;
  isDebounced?: boolean;
  onChange?: (value: SearchValue) => void;
  placeholder?: string;
  sx?: BoxProps['sx'];
  value?: SearchValue;
  useMinChar?: boolean;
}

export type SearchValue = {
  sortList?: {
    sortType: string;
    columnName: string;
    sortBy: 'ASC' | 'DESC';
  };
  searchDetail?: {
    key: string;
    value: string;
  };
  filter?: {
    [key: string]: string | Array<string> | number | AutocompleteOption;
  };
}
