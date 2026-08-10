import type { TableHeader } from '@/components/shared/Table/Table.types';


const DEBTOR_INFORMATION = [
  {
    label: 'Nama Customer',
    value: '[Nama Customer]',
  },
  {
    label: 'Tahun Didirikan',
    value: '[Tahun]',
  },
  {
    label: 'Jenis Sektor Usaha',
    value: '[Sektor]',
  },
  {
    label: 'Hubungan dengan SMI Sejak Tahun',
    value: '[Tahun]',
  },
  {},
  {
    label: 'Nama Grup Usaha',
    value: '[Nama Grup Usaha]',
  },
  {
    label: 'Tahun Didirikan',
    value: '[Tahun]',
  },
  {
    label: 'Terafiliasi dengan SMI',
    value: '[Ya/Tidak]',
  },
  {
    label: 'Contact Person',
    value: '[Nama]',
  },
  {
    label: 'Jabatan',
    value: '[Jabatan]',
  },
];


const HEADER_TOTAL_EXPOSURE_GROUP: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama Group',
  },
  {
    key: 'establishedYear',
    label: 'Tahun Didirkan',
  },
  {
    key: 'plafond',
    label: 'Plafond',
  },
  {
    key: 'os',
    label: 'O/S',
  },
  {
    key: 'proposed',
    label: 'Propose (Eqv IDR)',
  },
];


const PROCESS_TYPE = [
  {
    label: 'Reguler NON PEMBDA',
    value: '',
  },
  {
    label: 'Reguler PEMDA',
    value: '',
  },
  {
    label: 'PEMDA',
    value: '',
  },
  {
    label: 'BLU',
    value: '',
  },
  {
    label: 'Annual Review',
    value: '',
  },
  {
    label: 'Restrukturisasi Reguler',
    value: '',
  },
  {
    label: 'Restrukturisasi Relaksasi',
    value: '',
  }
];

const FINANCING_TYPE = [
  {
    label: 'Project Financing',
    value: '',
  },
  {
    label: 'Corporate Financing',
    value: '',
  },
  {
    label: 'Municipal',
    value: '',
  },
];

const KINERJA_KEUANGAN = [
  {
    label: 'Aset',
    value: '[Aset]',
  },
  {
    label: 'Pendapatan',
    value: '[Pendapatan]',
  },
  {
    label: 'Ebitda',
    value: '[EBITDA]',
  },
  {
    label: 'Liabilitas',
    value: '[Liabilitas]',
  },
  {
    label: 'Laba Bersih',
    value: '[Laba Bersih]',
  },
  {
    label: 'Ekuitas',
    value: '[Ekuitas]',
  }
];

const EKSPOSURE_Customer = [
  {
    label: 'Plafond',
    value: '[Plafond]',
  },
  {
    label: 'OS',
    value: '[OS]',
  },
  {
    label: 'Propose',
    value: '[Propose]',
  },
];


export {
  DEBTOR_INFORMATION,
  HEADER_TOTAL_EXPOSURE_GROUP,
  PROCESS_TYPE,
  FINANCING_TYPE,
  KINERJA_KEUANGAN,
  EKSPOSURE_Customer,
};
