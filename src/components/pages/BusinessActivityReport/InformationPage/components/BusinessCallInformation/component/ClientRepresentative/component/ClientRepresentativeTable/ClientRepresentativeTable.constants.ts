import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';


export interface SmiMemberType extends AutocompleteOption {
  id: string;
  label: string;
  position: string;
  positionLabel: string;
}
