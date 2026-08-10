import type { FieldValues, UseFormReturn } from 'react-hook-form';


export type ExposureDebtorSectionProps = UseFormReturn<FieldValues, any, undefined> & {
  isAsOf?: boolean;
  valueAsOf?: string;
  exposuresData: Array<{
    currency: string;
    label: string;
    value: string;
    viewOnly?: boolean;
  }>;
}
