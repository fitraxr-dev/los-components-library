import type { FieldValues, UseFormReturn } from 'react-hook-form';


export type FinancialPerformanceSectionProps = UseFormReturn<FieldValues, any, undefined> & {
  viewOnly?: boolean;
}
