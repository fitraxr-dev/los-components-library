// No, Tipe, Nama, NPWP, Jabatan, NIK, Collectability, Status Collectability Per, Last Modified, Modified By, Action

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
  },
  {
    key: 'name',
    label: 'Nama',
  },
  {
    key: 'npwp',
    label: 'NPWP',
  },
  {
    key: 'position',
    label: 'Jabatan',
  },
  {
    key: 'nik',
    label: 'NIK',
  },
  {
    key: 'collectability',
    label: 'Collectability',
  },
  {
    key: 'collectabilityStatus',
    label: 'Status Collectability Per',
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


export const DUMMY_DATA = [

];
