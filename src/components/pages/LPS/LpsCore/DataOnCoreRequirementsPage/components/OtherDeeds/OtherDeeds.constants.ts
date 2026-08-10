import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'no',
    label: 'No',
  },
  {
    key: 'noNotar',
    label: 'No. Notary Deed',
  },
  {
    key: 'lastNotarDate',
    label: 'Last Notary Deed Date',
  },
  {
    key: 'firstNotarDate',
    label: 'First Notary Deed Date',
  },
  {
    key: 'lastModified',
    label: 'Last modified',
  },
  {
    key: 'noLastNotar',
    label: 'No. Last Notary Deed',
  },
  {
    key: 'modifiedBy',
    label: 'Modified by',
  },
];


export const DATA_DUMMY = [
  {
    firstNotarDate: '12/12/2021',
    lastModified: '12/12/2021',
    lastNotarDate: '12/12/2021',
    modifiedBy: 'John Doe',
    no: 1,
    noLastNotar: '123456789',
    noNotar: '1234567890',
  },
  {
    firstNotarDate: '12/12/2021',
    lastModified: '12/12/2021',
    lastNotarDate: '12/12/2021',
    modifiedBy: 'John Doe',
    no: 2,
    noLastNotar: '123456789',
    noNotar: '1234567890',
  },
];
