import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDetailSiteVisit = ({ detailId: string }) => {

  const smiVisitData = [
    {
      division: 'Humas',
      name: 'Santoso',
      position: 'Staff',
    },
    {
      division: 'Humas',
      name: 'Mukidi',
      position: 'Staff',
    }
  ];

  const fileSiteVisitList = [
    {
      fileName: 'Tralala.png',
      fileType: 'png',
      uploadedBy: 'Siu',
      uploadedDate: '12 Januari 2000',
    },
    {
      fileName: 'Tralala.png',
      fileType: 'png',
      uploadedBy: 'Siu',
      uploadedDate: '12 Januari 2000',
    },
  ];

  const clientVisitData = [
    {
      name: 'Masinton',
      position: 'Caleg Dapil 1',
    }
  ];

  const othersVisitData = [
    {
      agency: 'YG',
      name: 'Surya',
      position: 'Manager',
    }
  ];

  const documentList = [
    {
      division: 'Division',
      documentDate: '25 September 2023',
      documentName: 'Memo Deviasi',
      documentNumber: 'CC-0110/SMI/DPOP/001',
      documentType: 'Memo Deviasi',
      groupDocument: 'Group 1',
      uploadBy: 'Aditya Putra',
      uploadDate: '25 September 2023',
    },
    {
      division: 'Division',
      documentDate: '25 September 2023',
      documentName: 'Memo Deviasi',
      documentNumber: 'CC-0110/SMI/DPOP/001',
      documentType: 'Memo Deviasi',
      groupDocument: 'Group 1',
      uploadBy: 'Aditya Putra',
      uploadDate: '25 September 2023',
    }
  ];

  const smiVisitHeader: TableHeader[] = [
    {
      key: 'division',
      label: 'Divisi',
    },
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'position',
      label: 'Position',
    },
  ];

  const clientVisitHeader: TableHeader[] = [
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'position',
      label: 'Jabatan',
    },
  ];

  const othersVisitHeader: TableHeader[] = [
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'position',
      label: 'Jabatan',
    },
    {
      key: 'agency',
      label: 'Instansi',
    },
  ];

  const siteVisitDocument: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '4%' },
      type: 'index',
    },
    {
      key: 'groupDocument',
      label: 'Group Dokumen',
      sx: { width: '14%' },
    },
    {
      key: 'documentType',
      label: 'Jenis Dokumen',
      sx: { width: '14%' },
    },
    {
      key: 'documentName',
      label: 'Nama Dokumen',
      sx: { width: '14%' },
    },
    {
      key: 'documentNumber',
      label: 'Nomor Dokumen',
      sx: { width: '14%' },
    },
    {
      key: 'documentDate',
      label: 'Tanggal Dokumen',
      sx: { width: '14%' },
    },
    {
      key: 'uploadBy',
      label: 'Uploaded By',
      sx: { width: '14%' },
    },
    {
      key: 'division',
      label: 'Divisi',
      sx: { width: '14%' },
    },
    {
      key: 'uploadDate',
      label: 'Uploaded Date',
      sx: { width: '14%' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit', onClick: (data) => {},
        },
        {
          iconName: 'show', onClick: (data) => {},
        },
        {
          iconName: 'download', onClick: (data) => {},
        },
        {
          iconName: 'delete', onClick: (data) => {},
        },
      ],
      sx: { width: '14%' },
      type: 'action',
    },
  ];

  const fileSiteVisit: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '4%' },
      type: 'index',
    },
    {
      key: 'fileName',
      label: 'Nama File',
      sx: { width: '14%' },
    },
    {
      key: 'fileType',
      label: 'Tipe File',
      sx: { width: '14%' },
    },
    {
      key: 'uploadedBy',
      label: 'Uploaded By',
      sx: { width: '14%' },
    },
    {
      key: 'uploadedDate',
      label: 'Uploaded Date',
      sx: { width: '14%' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit', onClick: (data) => {},
        },
        {
          iconName: 'show', onClick: (data) => {},
        },
        {
          iconName: 'download', onClick: (data) => {},
        },
        {
          iconName: 'delete', onClick: (data) => {},
        },
      ],
      sx: { width: '8%' },
      type: 'action',
    },
  ];

  return {
    clientVisitData,
    clientVisitHeader,
    documentList,
    fileSiteVisit,
    fileSiteVisitList,
    othersVisitData,
    othersVisitHeader,
    siteVisitDocument,
    smiVisitData,
    smiVisitHeader,
  };
};

export default useDetailSiteVisit;
