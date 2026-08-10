import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';
import type {
  Control,
  FieldValues,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';


export type FormDebtorProps = {
  control: Control;
  resetField?: UseFormResetField<FieldValues>;
  disabledFields: FormDebtorFieldOptions;
  mandatoryFields: FormDebtorFieldOptions;
  userId?: number;
  debtorId?: string;
  watch: UseFormWatch<FieldValues>;
  setValue?: UseFormSetValue<FieldValues>;
  bucketProcessId: string;
  listText?: string[];
}

export type FormDebtorFieldOptions = {
  insitutionTypeId?: boolean;
  debtorName?: boolean;
  npwp?: boolean;
  createdDate?: boolean;
  group?: boolean;
  dataSource?: boolean;
  typeProcess?: boolean;
  gam?: boolean;
  financingType?: boolean;
  analyst?: boolean;
  remarks?: boolean;
  debtorRating?: boolean;
  debtorType?: boolean;
  isRelatedToSmi?: boolean;
  isGroup?: boolean;
  debtorNameOther?: boolean;
};

export type FormDebtorType = {
  institutionTypeId?: string;
  debtorName?: string;
  npwp?: string;
  group?: AutocompleteOption;
  dataSource?: string;
  typeProcess?: string;
  gam?: AutocompleteOption;
  financingType?: string;
  analyst?: AutocompleteOption;
  remarks?: string;
}
