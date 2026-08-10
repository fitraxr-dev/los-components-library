import type { Dropdown, InputFieldType } from '../Input/Input.types';
import type { BoxProps, TextFieldProps } from '@mui/material';


export type InputListPlaceholder = {
  label: string;
  onChange: (text: string | FileOutput | number | boolean | any[] | object) => void;
  placeholder?: string;
  type?: InputFieldType;
  value?: string | FileOutput | number | boolean | any[] | object;
  disabled?: boolean;
  emptyField?: boolean;
  containerSx?: BoxProps['sx'];
  dropdownList?: Dropdown[];
  inputSx?: TextFieldProps['sx'];
  maxLength?: number;
  error?: boolean;
  helperText?: string;
  isMandatory?: boolean;
}


export type InputListProps = {
  fieldList: Array<InputListPlaceholder>;
  column: number;
}
