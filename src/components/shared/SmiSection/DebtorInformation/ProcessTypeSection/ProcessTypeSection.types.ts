import type { SxProps, Theme } from '@mui/material';
import type { FieldValues, UseFormReturn } from 'react-hook-form';


export type ProcessTypeSectionProps = UseFormReturn<FieldValues, any, undefined> & {
  radioList: Array<Record<PropertyKey, any>>;
  viewOnly?: boolean;
  sxOptions?: SxProps<Theme>;
}
