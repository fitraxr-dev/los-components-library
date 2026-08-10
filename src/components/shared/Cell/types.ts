import type { AutocompleteProps } from '@/components/shared/Autocomplete/types';
import type { ReactNode } from 'react';
import type { Control, FieldValues } from 'react-hook-form';


export type CellProps = {
  title?: string;
  titleNode?: ReactNode;
  value?: any;
  type?: 'text' | 'link' | 'dropdown' | 'autocomplete' | 'buttons';
  options?: CellOptions;
  autoCompleteOptions?: AutoCompleteOptions;
  buttons?: Array<ButtonOptions>;
  isMandatory?: boolean;
  wrapText?: boolean;
  maxLines?: number;
  hasDataMaster?: string | null;
}

export type CellOptions = {
  bottomBorder?: string;
  bottomBorderColor?: string;
  titleColor?: string;
  [key: string]: any;
}

export type AutoCompleteOptions = {
  input: AutocompleteProps;
}

export type ButtonOptions = {
  iconName: string;
  label: string;
  action: () => void;
  disabled?: boolean;
}
