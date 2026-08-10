import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableDocumentRefina = () => {

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
      key: 'documentName',
      label: 'Nama Dokumen',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'description',
      label: 'Deskripsi',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'documentTo',
      label: 'Ditujukan Ke',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'updateAt',
      label: 'Diperbaharui Pada',
      sx: {
        minWidth: '10vw',
      },
    },
  ];

  const documentRefinaList = [
    {
      fileLink: '-',
      fileName: '-',
    },
    {
      fileLink: '-',
      fileName: '-',
    }
  ];

  return {
    documentRefinaList,
    tableHeader,
  };
};

export default useTableDocumentRefina;
