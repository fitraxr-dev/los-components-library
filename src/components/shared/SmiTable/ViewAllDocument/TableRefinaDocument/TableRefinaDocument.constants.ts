import type { TableHeader } from '@/components/shared/Table/Table.types';


export const mockTableData = [
  {
    addressedTo: '[addressed to]',
    description: '[description]',
    documentName: '[document name]',
    updatedAt: '[updated at]',
  },
];

export const MODAL_UPLOAD_DOCUMENT_REFINA = 'MODAL_UPLOAD_DOCUMENT_REFINA';

export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'documentName',
    label: 'Nama Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'description',
    label: 'Deskripsi',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentTo',
    label: 'Ditujukan Ke',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'updateAt',
    label: 'Diperbaharui Pada',
    sx: {
      minWidth: '10vw',
    },
  },
];
