import type { TableHeader } from '@/components/shared/Table/Table.types';


export const mockTableData = [
  {
    aging: '30 days',
    covenant: 'Covenant',
    deadline: '2024-12-31',
    divisionLabel: 'Business Division',
    document: 'https://example.com/document1.pdf',
    documentExtension: 'pdf',
    documentGroupLabel: 'ELO Document Group 1',
    documentName: 'ELO_Document_001_01012024.pdf',
    documentNumber: 'ELO-001-2024',
    documentType: 'ELO Document Type 1',
    dpopName: 'DPOP Staff',
    dueDate: '2024-12-31',
    fileName: 'ELO_Document_001_01012024.pdf',
    hasSubmitted: true,
    id: 1,
    inTermsOf: 'Loan Agreement',
    isDeletable: true,
    isEditable: true,
    isFromOtherProcess: false,
    staffName: 'RM Staff',
    uploadedBy: 'John Doe',
    uploadedDate: '2024-01-01',
  },
  {
    aging: '15 days',
    covenant: 'Non-Covenant',
    deadline: '2024-11-30',
    divisionLabel: 'Business Division',
    document: 'https://example.com/document2.pdf',
    documentExtension: 'pdf',
    documentGroupLabel: 'ELO Document Group 2',
    documentName: 'ELO_Document_002_01012024.pdf',
    documentNumber: 'ELO-002-2024',
    documentType: 'ELO Document Type 2',
    dpopName: 'DPOP Staff',
    dueDate: '2024-11-30',
    fileName: 'ELO_Document_002_01012024.pdf',
    hasSubmitted: false,
    id: 2,
    inTermsOf: 'Financial Report',
    isDeletable: false,
    isEditable: false,
    isFromOtherProcess: true,
    staffName: 'RM Staff',
    uploadedBy: 'Jane Smith',
    uploadedDate: '2024-01-02',
  }
];

export const MODAL_UPLOAD_DOCUMENT_ELO = 'MODAL_UPLOAD_DOCUMENT_ELO';

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
    key: 'documentGroupLabel',
    label: 'Group Dokumen',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'isConvenant',
    label: 'Covenant/Non Covenant',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'documentType',
    label: 'Jenis Dokumen',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'rm',
    label: 'RM',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'dpop',
    label: 'DPOP',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'documentName',
    label: 'Nama Dokumen',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Jatuh Tempo/ Batas Waktu Pemenuhan',
    sx: {
      minWidth: '14vw',
    },
  },
  {
    key: 'aging',
    label: 'Aging',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    sx: {
      minWidth: '12vw',
    },
  },
];
