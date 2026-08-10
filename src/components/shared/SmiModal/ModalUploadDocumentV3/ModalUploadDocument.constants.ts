import type { AutocompleteOption } from '../../Autocomplete/types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


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

export const TABLE_HEADER_UPLOAD_DOCUMENT: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'documentGroupLabel',
    label: 'Group Dokumen',
    sx: { minWidth: '20vw' },
  },
  {
    key: 'documentTypeLabel',
    label: 'Jenis Dokumen',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'fileName',
    label: 'Nama Dokumen',
    sx: { minWidth: '20vw' },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    sx: { minWidth: '10vw' },
    type: 'date-only',
  },
  {
    key: 'createdBy',
    label: 'Uploaded By',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'divisionLabel',
    label: 'Divisi',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'createdDate',
    label: 'Uploaded Date',
    sx: { minWidth: '10vw' },
    type: 'date',
  },
];
