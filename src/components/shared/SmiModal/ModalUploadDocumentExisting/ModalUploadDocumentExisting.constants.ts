import { DocumentTypeRequestDtoOwnershipEnum } from '@/services/openapi/bucket-document-service';

import type { AutocompleteOption } from '../../Autocomplete/types';
import type { TableHeader } from '../../Table/Table.types';


export const modal = {
  MODAL_UPLOAD_DOCUMENT_EXISTING: 'MODAL_UPLOAD_DOCUMENT_EXISTING',
};

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


export const TABLE_HEADER_MODAL_UPLOAD_DOCUMENT_EXISTING: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },

  {
    key: 'fileName',
    label: 'Nama Dokumen',
    sx: { minWidth: '00vw' },
  },
  {
    key: 'documentGroupLabel',
    label: 'Group Dokumen',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'documentTypeLabel',
    label: 'Jenis Dokumen',
    sx: { minWidth: '10vw' },
  },
];


export const pathDocumentParentListApuppt = [
  { documentParent: DocumentTypeRequestDtoOwnershipEnum.DOCUMENTDEBTOR,
    path: 'debtor-document',
  },
  { documentParent: DocumentTypeRequestDtoOwnershipEnum.BENEFICIALOWNER,
    path: 'beneficial-owner',
  },
  { documentParent: DocumentTypeRequestDtoOwnershipEnum.CUSTOMERDUEDILIGENCE,
    path: 'customer-due-diligence',
  },
  { documentParent: DocumentTypeRequestDtoOwnershipEnum.ADDITIONALDOCUMENT,
    path: 'notes',
  }
];
