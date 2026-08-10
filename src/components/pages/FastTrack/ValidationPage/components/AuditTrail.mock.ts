export interface AuditTrailItem {
  id: number;
  section: string;
  actionType: string;
  documentNumber: string;
  uploadBy: string;
  division: string;
  uploadedDate: string;
}

export interface ComparisonRow {
  parameter: string;
  before: string;
  after: string;
  isChanged?: boolean;
  isTlConfirmation?: boolean;
}

export interface HistoryItem {
  changeNumber: number;
  changeLabel: string;
  date: string;
  changedBy: string;
  version: string;
  remark: string;
}

export interface AuditTrailDetail {
  header: {
    jenisDokumen: string;
    namaDokumen: string;
    nomorDokumen: string;
    versi: string;
  };
  currentChange: {
    changeNumber: number;
    changeLabel: string;
    changeDate: string;
    changes: ComparisonRow[];
  };
  changeHistory: HistoryItem[];
}

export const MOCK_AUDIT_TRAIL_LIST: AuditTrailItem[] = [
  {
    actionType: 'Updated',
    division: 'Divisi Pembiayaan 2',
    documentNumber: 'xxx',
    id: 1,
    section: 'APU PPT',
    uploadBy: 'Putri Anita',
    uploadedDate: '2024-12-24T14:35:22.000Z',
  },
  {
    actionType: 'Create',
    division: 'Divisi Pembiayaan 2',
    documentNumber: 'xxxx',
    id: 2,
    section: 'APU PPT',
    uploadBy: 'Putri Anita',
    uploadedDate: '2024-12-23T11:20:33.000Z',
  },
];

export const MOCK_AUDIT_TRAIL_DETAILS: Record<number, AuditTrailDetail> = {
  1: {
    changeHistory: [
      {
        changeLabel: '#5 (Terbaru)',
        changeNumber: 5,
        changedBy: 'Budi Santoso',
        date: '20 mei 2024 14:35:22 WIB',
        remark: 'Perubahan XXX',
        version: '2.0',
      },
      {
        changeLabel: '#4',
        changeNumber: 4,
        changedBy: 'Andi Wijaya',
        date: '10 Maret 2024 11:20:33 WIB',
        remark: 'Dokumen Awal',
        version: '1.0',
      },
    ],
    currentChange: {
      changeDate: '20 mei 2024 14:35:22 WIB',
      changeLabel: 'Perubahan #5',
      changeNumber: 5,
      changes: [
        { after: 'SOP', before: 'SOP', isChanged: false, parameter: 'Jenis Dokumen' },
        { after: 'SOP Pengadaan Barang dan Jasa', before: 'SOP Pengadaan Barang', isChanged: true, parameter: 'Nama Dokumen' },
        { after: 'SOP/PROC/001', before: 'SOP/PROC/001', isChanged: false, parameter: 'Nomor Dokumen' },
        { after: '01 Januari 2024', before: '01 Januari 2024', isChanged: false, parameter: 'Tanggal Dokumen' },
        { after: 'Andi Wijaya', before: 'Andi Wijaya', isChanged: false, parameter: 'Uploaded By' },
        { after: 'Procurement', before: 'Procurement', isChanged: false, parameter: 'Divisi' },
        { after: '01 Januari 2024 09:15:10 WIB', before: '01 Januari 2024 09:15:10 WIB', isChanged: false, parameter: 'Uploaded Date' },
        { after: 'Sudah dikonfirmasi', before: 'Belum Di Konfirmasi', isChanged: true, isTlConfirmation: true, parameter: 'TL Confirmation (only tl change)' },
        { after: 'Citra Lestari', before: '-', isChanged: true, parameter: 'Confirmed By' },
        { after: '20 Mei 2024 15:01:11 WIB', before: '-', isChanged: true, parameter: 'Confirmed Date' },
        { after: 'Dokumen Awal', before: 'Dokumen Awal', isChanged: false, parameter: 'Keterangan' },
      ],
    },
    header: {
      jenisDokumen: 'SOP',
      namaDokumen: 'SOP Pengadaan Barang',
      nomorDokumen: 'SOP/PROC/001',
      versi: '2.0',
    },
  },
  2: {
    changeHistory: [
      {
        changeLabel: '#4 (Terbaru)',
        changeNumber: 4,
        changedBy: 'Andi Wijaya',
        date: '10 Maret 2024 11:20:33 WIB',
        remark: 'Dokumen Awal',
        version: '1.0',
      },
    ],
    currentChange: {
      changeDate: '10 Maret 2024 11:20:33 WIB',
      changeLabel: 'Perubahan #4',
      changeNumber: 4,
      changes: [
        { after: 'SOP', before: 'SOP', isChanged: false, parameter: 'Jenis Dokumen' },
        { after: 'SOP Pengadaan Barang', before: 'SOP Pengadaan Barang', isChanged: false, parameter: 'Nama Dokumen' },
        { after: 'SOP/PROC/001', before: 'SOP/PROC/001', isChanged: false, parameter: 'Nomor Dokumen' },
        { after: '01 Januari 2024', before: '01 Januari 2024', isChanged: false, parameter: 'Tanggal Dokumen' },
        { after: 'Andi Wijaya', before: 'Andi Wijaya', isChanged: false, parameter: 'Uploaded By' },
        { after: 'Procurement', before: 'Procurement', isChanged: false, parameter: 'Divisi' },
        { after: '01 Januari 2024 09:15:10 WIB', before: '01 Januari 2024 09:15:10 WIB', isChanged: false, parameter: 'Uploaded Date' },
        { after: 'Belum Di Konfirmasi', before: 'Belum Di Konfirmasi', isChanged: false, isTlConfirmation: true, parameter: 'TL Confirmation (only tl change)' },
        { after: '-', before: '-', isChanged: false, parameter: 'Confirmed By' },
        { after: '-', before: '-', isChanged: false, parameter: 'Confirmed Date' },
        { after: 'Dokumen Awal', before: 'Dokumen Awal', isChanged: false, parameter: 'Keterangan' },
      ],
    },
    header: {
      jenisDokumen: 'SOP',
      namaDokumen: 'SOP Pengadaan Barang',
      nomorDokumen: 'SOP/PROC/001',
      versi: '1.0',
    },
  },
};
