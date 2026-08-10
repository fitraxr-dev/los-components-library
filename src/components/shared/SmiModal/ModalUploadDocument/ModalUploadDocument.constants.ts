import type { AutocompleteOption } from '../../Autocomplete/types';


export const modal = {
  MODAL_UPLOAD_DOCUMENT: 'MODAL_UPLOAD_DOCUMENT',
};

export const documentCategoryDropdownList: AutocompleteOption[] = [
  {
    id: 'FINANCING_DOCUMENT',
    label: 'Document Pembiayaan',
  },
  {
    id: 'SUPPORTING_DOCUMENT',
    label: 'Supporting Document',
  },
  {
    id: 'ELO',
    label: 'Document ELO',
  }
];

export const documentCategoryDropdownLisWithoutDocElo: AutocompleteOption[] = [
  {
    id: 'FINANCING_DOCUMENT',
    label: 'Document Pembiayaan',
  },
  {
    id: 'SUPPORTING_DOCUMENT',
    label: 'Supporting Document',
  }
];
