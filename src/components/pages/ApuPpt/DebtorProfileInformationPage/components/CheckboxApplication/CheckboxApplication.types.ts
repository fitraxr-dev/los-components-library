import type { NumberFormatValues, SourceInfo } from '@/components/shared/Input/components/Number/types';
import type { InputFieldType, TimeSteps } from '@/components/shared/Input/Input.types';
import type { BoxProps, TextFieldProps } from '@mui/material';


export type CheckboxApplicationProps = {
  color?: string;
  containerSx?: BoxProps['sx'];
  checkboxList?: Checkbox[];
  disabled?: boolean;
  dropdownList?: Dropdown[];
  inputSx?: TextFieldProps['sx'];
  isMandatory?: boolean;
  label?: string;
  labelProps?: any;
  maxDecimal?: number;
  maxLength?: number;
  maxDate?: string;
  minDate?: string;
  noBorder?: boolean;
  noDecimal?: boolean;
  onChange?: (val: any) => void;
  placeholder?: string;
  type?: InputFieldType;
  value?: string | FileOutput | number | boolean | any[] | object;
  regex?: RegExp;
  timeSteps?: TimeSteps;
  popper?: any;
  position?: 'horizontal' | 'vertical';
  format?: string;
  isDownloadable?: boolean;
  contentList?: Array<ContentList>;
  dropdownPlaceholder?: string;
  id?: string;
  testId?: string;
  radioList?: Array<{
    label: string;
    value: string | boolean;
  }> | any;
  sx?: BoxProps['sx'];
  sxOptions?: BoxProps['sx'];
  openTo?: 'day' | 'month' | 'year';
  view?: 'day' | 'month' | 'year';
  views?: Array<'day' | 'month' | 'year'>;
  iconColor?: string;
  select?: boolean;
  selectProps?: Object;
  children?: React.ReactNode;
  onBlur?: () => void;
  fileConstraint?: string;
  downloadOnly?: boolean;
  decimalScale?: number;
  onValueChange?: (values: NumberFormatValues, sourceInfo: SourceInfo) => void;
  thousandSeparator?: boolean | string;
  isAllowed?: (val: any) => boolean;
  withSymbols?: boolean;
  widthYearWrapper?: string;
  widthMonthWrapper?: string;
  topComponent?: JSX.Element;
  showPreviewFile?: boolean;
  error?: boolean;
  helperText?: string;
  bgCheckBox?: (val: string) => void;
  valMasterData?: string;
  needCheckMaster?: boolean;
  appliPurpose?: string[];
}

export type ContentList = {
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
}


export type AutocompleteOption = {
  id?: string | number;
  label: string;
}

export type Checkbox = {
  label: string;
  value: string | number;
  disabled?: boolean;
  renderAdditionalContent?: () => JSX.Element;
  additionalCheckboxSx?: BoxProps['sx'];
}


export type Dropdown = {
  label: string;
  value: string | number;
}
