import type { Dropdown } from '@/components/shared/Input/Input.types';
import type { FieldError, FieldValues, UseFormReturn } from 'react-hook-form';


export type DebtorDetailSectionProps = UseFormReturn<FieldValues, any, undefined> & {
  jobPositionData: Dropdown[];
  viewOnly?: boolean;
}

export type CustomFieldError = FieldError & {id: FieldError; label: FieldError }
