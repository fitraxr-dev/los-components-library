import type { Control, FieldValues, UseFormWatch } from 'react-hook-form';


export type FinancingDocumentDraftModalProps = {
  control: Control<FieldValues, any>;
  values: UseFormWatch<FieldValues>;
}
