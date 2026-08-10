import type { Control, FieldValues, UseFormWatch } from 'react-hook-form';


export type SupportingDocumentDraftModalProps = {
  control: Control<FieldValues, any>;
  values: UseFormWatch<FieldValues>;
}
