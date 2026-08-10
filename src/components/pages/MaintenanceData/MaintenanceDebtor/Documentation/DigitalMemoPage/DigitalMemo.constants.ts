import type { TableHeader } from '@/components/shared/Table/Table.types';


export const mockTableData = [
  {
    creatorName: 'Creator Name',
    divisionCreator: 'Division Creator',
    documentDate: 'Tanggal Dokumen',
    documentGroup: 'Group Dokumen',
    documentName: 'Nama Dokumen',
    documentNumber: 'Nomor Dokumen',
    documentType: 'Jenis Dokumen',
    masterId: 'Master ID',
    processId: 'ID Process',
    status: 'COMPLETED',
    statusLabel: 'Completed',
    uploadBy: 'Upload By',
    uploadDate: 'Upload Date',
  },
  {
    creatorName: 'Creator Name',
    divisionCreator: 'Division Creator',
    documentDate: 'Tanggal Dokumen',
    documentGroup: 'Group Dokumen',
    documentName: 'Nama Dokumen',
    documentNumber: 'Nomor Dokumen',
    documentType: 'Jenis Dokumen',
    masterId: 'Master ID',
    processId: 'ID Process',
    status: 'COMPLETED',
    statusLabel: 'Completed',
    uploadBy: 'Upload By',
    uploadDate: 'Upload Date',
  },
];

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
    key: 'bucketMasterId',
    label: 'Master ID',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'bucketProcessId',
    label: 'ID Process',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'status',
    label: 'Status',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentGroupLabel',
    label: 'Group Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentTypeLabel',
    label: 'Jenis Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'fileName',
    label: 'Nama Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
];
