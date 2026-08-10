import type { Control, FieldValues, UseFormWatch } from 'react-hook-form';


export type DigitalMemoDraftModalProps = {
  control: Control<FieldValues, any>;
  values: UseFormWatch<FieldValues>;
}
