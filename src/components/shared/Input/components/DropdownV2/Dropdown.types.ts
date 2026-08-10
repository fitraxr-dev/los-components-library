import type { Dropdown, InputProps } from '../../Input.types';
import type { MergeTypes } from '@/types/MergeType';
import type { BoxProps, TextFieldProps } from '@mui/material';


export type DropdownProps = MergeTypes<InputProps, {
  id?: string;
  testId?: string;
  inputRef?: any;
  label?: string;
  labelProps?: any;
  containerSx?: BoxProps['sx'];
  disabled?: boolean;
  disabledDropdown?: boolean;
  onChange?: (val: any) => void;
  placeholder?: string;
  value?: {
    dropdown: string;
    value: string | number;
  };
  maxLength?: number;
  error?: boolean;
  helperText?: string;
  dropdownList?: Dropdown[];
  inputSx?: TextFieldProps['sx'];
  isMandatory?: boolean;
}>
