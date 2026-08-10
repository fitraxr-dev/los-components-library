import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableDocumentELO = () => {

  const tableHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        width: '4vw',
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
      key: 'description',
      label: 'Perihal',
      sx: {
        minWidth: '10vw',
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

  const documentELOList = [];

  return {
    documentELOList,
    tableHeader,
  };
};

export default useTableDocumentELO;
