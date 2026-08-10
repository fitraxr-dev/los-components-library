import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';


export const modal = {
  MODAL_UPLOAD_DOCUMENT: 'MODAL_UPLOAD_DOCUMENT',
};

export const SUPPORTING_DOCUMENT_DEPI = 'SUPPORTING_DOCUMENT_DEPI';
export const RATING_UPLOAD_FILE_RATING_HISTORY = 'RATING_UPLOAD_FILE_RATING_&_HISTORY';

export const documentCategoryDropdownList: AutocompleteOption[] = [
  {
    id: 'FINANCING_DOCUMENT',
    label: 'Document Pembiayaan',
  },
  {
    id: 'SUPPORTING_DOCUMENT',
    label: 'Supporting Document',
  }
];
