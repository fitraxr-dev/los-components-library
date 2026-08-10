import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama Customer',
  },
  {
    key: 'sectorLabel',
    label: 'Sektor Industri',
  },
  {
    key: 'debtorId',
    label: 'Costumer ID',
  },
  {
    key: 'cif',
    label: 'CIF',
  },
  {
    key: 'gamName',
    label: 'General Account Manager',
  },
  {
    key: 'remark',
    label: 'Keterangan',
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
    type: 'date',
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
  },
];

export const TableHeaderList2: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'phase',
    label: 'Melampaui BMPK/BMPD/BMPP Group',
  },
  {
    key: 'statusAsOf',
    label: 'Data as of',
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
  },
];
