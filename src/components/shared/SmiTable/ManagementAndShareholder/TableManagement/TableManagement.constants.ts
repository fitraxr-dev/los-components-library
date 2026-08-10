import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '10vw',
    },
  },
  // {
  //   key: 'npwp',
  //   label: 'NPWP',
  //   sx: {
  //     minWidth: '10vw',
  //   },
  // },
  // {
  //   key: 'nik',
  //   label: 'NIK',
  //   sx: {
  //     minWidth: '10vw',
  //   },
  // },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'lastCheckedDate',
    label: 'Last Checked Date',
    sx: { minWidh: '12vw' },
  },
];

export const TABLE_HEADER_RESULT_LIST: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'collectibility',
    label: 'Kolektabilitas',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'resultReporting',
    label: 'Hasil Laporan',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'note',
    label: 'Catatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'googleResult',
    label: 'Google Search',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const tableHeaderListSummary: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'collectibility',
    label: 'Kolektabilitas',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'resultReporting',
    label: 'Hasil Laporan',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'note',
    label: 'Catatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'googleResult',
    label: 'Google Search',
    sx: {
      minWidth: '10vw',
    },
  },
];


export const tableHeaderListMIP: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'collectibility',
    label: 'Kolektabilitas',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'resultReporting',
    label: 'Hasil Laporan',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'note',
    label: 'Catatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'googleResult',
    label: 'Google Search',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const tableHeaderListRequest: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '10vw',
    },
  },
  // {
  //   key: 'npwp',
  //   label: 'NPWP',
  //   sx: {
  //     minWidth: '8vw',
  //   },
  // },
  // {
  //   key: 'nik',
  //   label: 'NIK',
  //   sx: {
  //     minWidth: '8vw',
  //   },
  // },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'lastCheckedDate',
    label: 'Last Checked Date',
    sx: { minWidth: '8vw' },
  }
];

export const TABLE_HEADER_LIST_DOCUMENT_VERIFICATION: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
];

export const tableHeaderListUploadResult: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'npwp',
    label: 'NPWP',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'nik',
    label: 'NIK',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
    sx: {
      minWidth: '12vw',
    },
  },
];

export const DROPDOWN_JABATAN = [
  {
    label: 'Direktur Keuangan',
    value: 'DIRUT',
  },
  {
    label: 'Office Boy',
    value: 'OB',
  },
];

export const MANAGEMENT_MOCKUP = [
  {
    dob: '21 Maret 2098',
    id: '1',
    jobPosition: 'Staff',
    name: 'Sulis',
    nik: '121223234433',
    nikFile: {
      extension: '',
      name: '',
      url: '',
    },
    npwp: '901828312231',
    npwpFile: {
      extension: '',
      name: '',
      url: '',
    },
  },
  {
    dob: '21 Maret 2098',
    id: '2',
    jobPosition: 'Staff',
    name: 'Akbar',
    nik: '121223234433',
    nikFile: {
      extension: '',
      name: '',
      url: '',
    },
    npwp: '901828312231',
    npwpFile: {
      extension: '',
      name: '',
      url: '',
    },
  }
];
