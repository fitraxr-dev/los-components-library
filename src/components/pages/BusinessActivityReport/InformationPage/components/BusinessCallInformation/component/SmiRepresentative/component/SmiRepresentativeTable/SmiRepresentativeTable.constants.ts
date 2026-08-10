import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';


export interface SmiMemberType extends AutocompleteOption {
  division: Array<any>;
  divisionLabel: string;
  id: string;
  label: string;
  position: string;
  positionLabel: string;
}
